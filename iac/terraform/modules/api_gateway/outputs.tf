# Output value definitions

output "api_gateway_id" {
  description = "The ID of the API Gateway"
  value       = aws_api_gateway_rest_api.this.id
}

output "api_gateway_execution_arn" {
  description = "The ID of the API Gateway"
  value       = aws_api_gateway_rest_api.this.execution_arn
}

output "api_gateway_base_path_id" {
  description = "The name of the API Gateway"
  value       = aws_api_gateway_resource.base_path.id
}
