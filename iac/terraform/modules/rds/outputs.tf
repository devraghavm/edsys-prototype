output "rds_proxy_arn" {
  description = "the arn of the RDS proxy, includes the rds proxy resource id, prx-<hash>"
  value = aws_db_proxy.mysql_proxy.arn
}

output "rds_proxy_endpoint" {
  description = "the name of the endpoint for the RDS proxy"
  value = aws_db_proxy_endpoint.aurora.endpoint
}

output "lambda_secret" {
  description = "the name of the Secrets Manager secret that stores the database user credentials"
  value = aws_secretsmanager_secret.lambda_secret.name
}

output "rds_proxy_log" {
  description = "CloudWatch log group name for RDS Proxy logs"
  value = aws_cloudwatch_log_group.this.id
}

output "lambda_secret_name" {
  description = "the name of the Secrets Manager secret that stores the database user credentials"
  value = aws_secretsmanager_secret.lambda_secret.name
}

output "lambda_secret_arn" {
  description = "the arn of the Secrets Manager secret that stores the database user credentials"
  value = aws_secretsmanager_secret.lambda_secret.arn
}