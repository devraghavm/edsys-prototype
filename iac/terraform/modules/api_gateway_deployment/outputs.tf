# Output value definitions

output "api_gateway_invoke_url" {
  description = "The invoke URL of the API Gateway"
  value       = aws_api_gateway_stage.stage.invoke_url
}
