variable "api_gateway_id" {
  description = "The ID of the API Gateway"
  type        = string
}

variable "app_name" {
  description = "The name of the application"
  type        = string
}

variable "resource_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "lambda_function_arn" {
  description = "The ARN of the Lambda function to be integrated with the API Gateway"
  type        = string
}

variable "lambda_function_invoke_arn" {
  description = "The ARN of the Lambda function to be integrated with the API Gateway"
  type        = string
}

variable "lambda_function_name" {
  description = "name of the lambda function to access rds proxy"
  type        = string
}

variable "api_gateway_execution_arn" {
  description = "The execution ARN of the API Gateway"
  type        = string
}

variable "api_gateway_base_path_id" {
  description = "The ID of the base path resource in the API Gateway"
  type        = string
}
