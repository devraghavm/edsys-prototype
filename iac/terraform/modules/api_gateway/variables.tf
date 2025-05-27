variable "app_name" {
  description = "The name of the application"
  type        = string
}
variable "lambda_log_retention" {
  description = "cloudwatch log retention setting"
  type        = number
}

variable "base_path" {
  description = "The base path for the API Gateway"
  type        = string
}
