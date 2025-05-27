output "lambda_function_invoke_arn" {
  value = aws_lambda_function.rds_proxy_function.invoke_arn
}

output "lambda_function_arn" {
  value = aws_lambda_function.rds_proxy_function.arn
}


output "lambda_function_name" {
  value = aws_lambda_function.rds_proxy_function.function_name
}

output "lambda_function_log" {
  value = aws_cloudwatch_log_group.rds_proxy_function.id
}

output "aws_ecr_repository_url" {
  description = "The URL of the ECR repository for the Lambda function"
  value       = aws_ecr_repository.lambda_ecr.repository_url
}
