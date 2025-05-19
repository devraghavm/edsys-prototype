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