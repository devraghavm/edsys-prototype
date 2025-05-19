variable "lambda_function_arn" {
  description = "The ARN of the Lambda function to be integrated with the API Gateway"
  type        = string
}

variable "api_gateway_name" {
  description = "The name of the API Gateway"
  type        = string
  default     = "MyApiGateway"
}

variable "api_gateway_description" {
  description = "A description of the API Gateway"
  type        = string
  default     = "API Gateway for Lambda integration"
}

variable "api_stage" {
  description = "The stage for the API Gateway"
  type        = string
  default     = "v1"
}

variable "cors_enabled" {
  description = "Enable CORS for the API Gateway"
  type        = bool
  default     = true
}

variable "resource_path" {
  description = "The resource path for the API Gateway"
  type        = string
  default     = "/api"
}

variable "lambda_function_invoke_arn" {
  description = "The ARN of the Lambda function to be integrated with the API Gateway"
  type        = string
}

variable "lambda_log_retention" {
  description = "cloudwatch log retention setting"
  type    = number
}

variable "rds_proxy_function_name" {
  description = "name of the lambda function to access rds proxy"
  type    = string
}