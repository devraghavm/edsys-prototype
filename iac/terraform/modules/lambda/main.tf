// get secret info

data "aws_secretsmanager_secret_version" "creds" {
  secret_id = var.lambda_secret_name
}

locals {
  lambda_username = jsondecode(
    data.aws_secretsmanager_secret_version.creds.secret_string
  )
}

# --- ECR Repository for Lambda Container Images ---
resource "aws_ecr_repository" "lambda_ecr" {
  name                 = "${var.app_name}-${var.lambda_function_name}-lambda-container-repo-${lower(var.random_string_id)}"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name = "${var.app_name} ${var.lambda_function_name} Lambda Container Repo"
  }
}

# --- Build and Push Lambda Container Image ---

resource "null_resource" "lambda_image_build_and_push" {
  provisioner "local-exec" {
    command = <<EOT
      aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${aws_ecr_repository.lambda_ecr.repository_url}
      docker build -t ${aws_ecr_repository.lambda_ecr.repository_url}:${var.lambda_image_tag} ${var.lambda_image_build_context}
      docker push ${aws_ecr_repository.lambda_ecr.repository_url}:${var.lambda_image_tag}
    EOT
    environment = {
      AWS_PROFILE = var.aws_profile
    }
  }

  triggers = {
    image_tag     = var.lambda_image_tag
    build_context = var.lambda_image_build_context
    ecr_repo_url  = aws_ecr_repository.lambda_ecr.repository_url
  }

  depends_on = [
    aws_ecr_repository.lambda_ecr
  ]
}

# --- Lambda Function Using Container Image ---
resource "aws_lambda_function" "rds_proxy_function" {
  function_name = "${var.app_name}-${var.lambda_function_name}-function-${var.random_string_id}"

  package_type = "Image"
  image_uri    = "${aws_ecr_repository.lambda_ecr.repository_url}:${var.lambda_image_tag}"

  role    = aws_iam_role.lambda_exec.arn
  timeout = 60

  vpc_config {
    subnet_ids         = var.vpc_subnets
    security_group_ids = [var.security_group]
  }

  environment {
    variables = {
      region             = var.aws_region
      lambda_secret_name = var.lambda_secret_name
      admin_secret_name  = var.admin_secret_name
    }
  }

  depends_on = [aws_ecr_repository.lambda_ecr, null_resource.lambda_image_build_and_push]
}

resource "aws_cloudwatch_log_group" "rds_proxy_function" {
  name = "/aws/lambda/${aws_lambda_function.rds_proxy_function.function_name}"

  retention_in_days = var.lambda_log_retention
}

resource "aws_iam_role" "lambda_exec" {
  name = "${title(var.app_name)}${title(var.lambda_function_name)}LambdaRole-${var.random_string_id}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_policy" "lambda-exec-role" {
  name = "${title(var.app_name)}${title(var.lambda_function_name)}LambdaPolicy-${var.random_string_id}"

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
          "Action": "secretsmanager:GetSecretValue",
          "Resource": "${var.lambda_secret_arn}",
          "Effect": "Allow"
        },
        {
            "Effect": "Allow",
            "Action": [
                "rds-db:connect"
            ],
            "Resource": "arn:aws:rds-db:${var.aws_region}:${var.account_id}:dbuser:${var.rds_proxy_resourceid}/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "ec2:CreateNetworkInterface",
                "ec2:DescribeNetworkInterfaces",
                "ec2:DeleteNetworkInterface",
                "ec2:AssignPrivateIpAddresses",
                "ec2:UnassignPrivateIpAddresses"
            ],
            "Resource": "*"
        }
    ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda-exec-role.arn
}
