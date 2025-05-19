resource "aws_db_subnet_group" "default" {
  name       = "db main"
  subnet_ids = var.db_subnet_ids

  tags = {
    Name = "My DB subnet group"
  }
}

resource "random_password" "db_password" {
  length           = 16
  special          = true
  override_special = "()-_=+"
}

resource "aws_rds_cluster" "aurora_mysql" {
  cluster_identifier      = var.cluster_identifier
  engine                  = var.db_engine
  engine_version          = var.db_engine_version
  availability_zones      = var.db_azs
  db_subnet_group_name    = aws_db_subnet_group.default.id
  database_name           = "mydb"
  master_username         = "admin"
  master_password         = random_password.db_password.result
  backup_retention_period = 5
  preferred_backup_window = "07:00-09:00"
  skip_final_snapshot     = true
  vpc_security_group_ids  = [var.security_group_ids.db_mysql]
}

resource "aws_rds_cluster_instance" "cluster_instance" {
  identifier         = "${var.cluster_identifier}-1"
  cluster_identifier = aws_rds_cluster.aurora_mysql.id
  instance_class     = var.db_instance_class
  db_subnet_group_name    = aws_db_subnet_group.default.id
  engine             = aws_rds_cluster.aurora_mysql.engine
  engine_version     = aws_rds_cluster.aurora_mysql.engine_version
}

resource "aws_instance" "this" {
  ami           = var.ami_id
  instance_type = "t3.micro"
  count = 1
  vpc_security_group_ids = [var.security_group_ids.lambda_sg, var.security_group_ids.ec2_sg]
  subnet_id = var.app_subnet_ids[0]
  associate_public_ip_address = false
  depends_on = [aws_rds_cluster_instance.cluster_instance, aws_secretsmanager_secret_version.sversion, aws_secretsmanager_secret_version.sversion1]
  user_data = <<EOF
#!/bin/bash

sudo yum update
sudo yum install mysql -y

mysql -u admin -p'${random_password.db_password.result}' -h '${aws_rds_cluster_instance.cluster_instance.endpoint}' <<MY_QUERY
CREATE USER '${var.username}'@'%' IDENTIFIED BY '${random_password.lambda_password.result}';
CREATE DATABASE IF NOT EXISTS ${var.database_name};
GRANT SELECT, INSERT, UPDATE ON ${var.database_name}.* TO '${var.username}';
FLUSH PRIVILEGES;
MY_QUERY

echo done
EOF
}

resource "random_password" "lambda_password" {
  length           = 16
  special          = true
  override_special = "()-_=+"
}

resource "aws_secretsmanager_secret" "lambda_secret" {
  name = "lambda_secret"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "sversion" {
  secret_id = aws_secretsmanager_secret.lambda_secret.id
  secret_string = <<EOF
   {
    "username": "${var.username}",
    "password": "${random_password.lambda_password.result}"
   }
EOF
}

resource "aws_secretsmanager_secret" "aurora-mysql-secret" {
  name = "aurora-mysql-secret"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "sversion1" {
  secret_id = aws_secretsmanager_secret.aurora-mysql-secret.id
  secret_string = <<EOF
   {
    "username": "admin",
    "password": "${random_password.db_password.result}"
   }
EOF
}

resource "aws_db_proxy" "mysql_proxy" {
  name                   = var.rds_proxy_name
  debug_logging          = true
  engine_family          = "MYSQL"
  idle_client_timeout    = 1800
  require_tls            = true
  role_arn               = aws_iam_role.rds_proxy.arn
  vpc_security_group_ids = [var.security_group_ids.db_mysql]
  vpc_subnet_ids         = var.app_subnet_ids

  auth {
    auth_scheme = "SECRETS"
    description = "RDS Proxy with IAM auth for master user"
    iam_auth    = "REQUIRED"
    secret_arn  = aws_secretsmanager_secret.aurora-mysql-secret.arn
  }
  
  auth {
    auth_scheme = "SECRETS"
    description = "RDS Proxy with IAM auth for lambda"
    iam_auth    = "REQUIRED"
    secret_arn  = aws_secretsmanager_secret.lambda_secret.arn
  }
  depends_on = [aws_cloudwatch_log_group.this]
}

resource "aws_db_proxy_default_target_group" "default" {
  db_proxy_name = aws_db_proxy.mysql_proxy.name

  connection_pool_config {
    connection_borrow_timeout    = 120
    max_connections_percent      = 100
    max_idle_connections_percent = 50
  }
}

resource "aws_db_proxy_target" "db_cluster" {
  db_cluster_identifier  = aws_rds_cluster.aurora_mysql.id
  db_proxy_name          = aws_db_proxy.mysql_proxy.name
  target_group_name      = aws_db_proxy_default_target_group.default.name
  depends_on = [aws_rds_cluster.aurora_mysql, aws_db_proxy.mysql_proxy, aws_rds_cluster_instance.cluster_instance]
}

resource "aws_db_proxy_endpoint" "aurora" {
  db_proxy_name          = aws_db_proxy.mysql_proxy.name
  db_proxy_endpoint_name = "lambda-aurora-proxy"
  vpc_subnet_ids         = var.app_subnet_ids
  target_role            = "READ_WRITE"
  vpc_security_group_ids = [var.security_group_ids.db_mysql]
}

// coudwatch 

resource "aws_cloudwatch_log_group" "this" {
  name              = "/aws/rds/proxy/${var.rds_proxy_name}"
  retention_in_days = var.log_retention
}
// IAM Role for rds proxy

resource "aws_iam_role" "rds_proxy" {
  name = "RdsProxyRole-${var.random_string_id}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "rds.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_policy" "rds_proxy_iam" {
  name = "RdsProxySecretsManager-${var.random_string_id}"

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "secretsmanager:GetSecretValue",
            "Resource": [
                "${aws_secretsmanager_secret.lambda_secret.arn}",
                "${aws_secretsmanager_secret.aurora-mysql-secret.arn}"
            ]
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "kms:Decrypt",
            "Resource": "arn:aws:kms:${var.aws_region}:${var.account_id}:key/aws/secretsmanager",
            "Condition": {
                "StringEquals": {
                    "kms:ViaService": "secretsmanager.${var.aws_region}.amazonaws.com"
                }
            }
        }
    ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "rds_policy" {
  role       = aws_iam_role.rds_proxy.name
  policy_arn = aws_iam_policy.rds_proxy_iam.arn
}