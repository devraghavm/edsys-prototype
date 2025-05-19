// get secret info

data "aws_secretsmanager_secret_version" "creds" {
  secret_id = var.lambda_secret_name
}

locals {
  lambda_username = jsondecode(
    data.aws_secretsmanager_secret_version.creds.secret_string
  )
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket_prefix = var.bucket_name
  force_destroy = true
  tags = {
    Name        = "${var.bucket_name}"
  }
}

resource "aws_s3_bucket_acl" "private_bucket" {
  bucket = aws_s3_bucket.lambda_bucket.id
  acl    = "private"
}

resource "null_resource" "my_lambda_buildstep" {
  triggers = {
    backend_changes = "${base64sha256(join("", fileset("${path.module}/../../backend", "**/*")))}"
  }

  provisioner "local-exec" {
    command = "${path.module}/../../../../backend/build.sh"
  }
}

data "archive_file" "lambda_source" {
  type = "zip"

  source_dir  = "${path.module}/../../backend/src"
  output_path = "${path.module}/../../backend/src.zip"
  
  depends_on = [null_resource.my_lambda_buildstep]
}

resource "aws_s3_object" "lambda" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "source.zip"
  source = data.archive_file.lambda_source.output_path

  #etag = filemd5(data.archive_file.lambda_source.output_path)
  depends_on = [null_resource.my_lambda_buildstep, data.archive_file.lambda_source]
  
}

//Define lambda function
resource "aws_lambda_function" "rds_proxy_function" {
  function_name = "rds_proxy_function-${var.random_string_id}"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda.key

  runtime = "nodejs22.x"
  handler = "lambda.handler"

  source_code_hash = data.archive_file.lambda_source.output_base64sha256
  
  description = "function to access RDS Aurora via RDS proxy endpoint"

  role = aws_iam_role.lambda_exec.arn
  timeout = 60
  
  vpc_config {
    subnet_ids         = var.vpc_subnets
    security_group_ids = [var.security_group]
  }
  
  environment {
    variables = {
      region: var.aws_region,
      rds_endpoint: var.rds_proxy_endpoint,
      port: 3306,
      username: local.lambda_username.username
      database: var.database_name
    }
  }
  
}

resource "aws_cloudwatch_log_group" "rds_proxy_function" {
  name = "/aws/lambda/${aws_lambda_function.rds_proxy_function.function_name}"

  retention_in_days = var.lambda_log_retention
}

resource "aws_iam_role" "lambda_exec" {
  name = "LambdaRdsProxyRole-${var.random_string_id}"

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
  name = "LambdaRdsProxyPolicy-${var.random_string_id}"

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
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