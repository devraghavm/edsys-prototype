variable "bucket_name" {
  description = "name of the s3 bucket"
  type    = string
}

variable "vpc_subnets" {
  description = "vpc subnets for lambda function"
  type    = list(string)
}

variable "security_group" {
  description = "security group associated with lambda function"
  type        = string
}

variable "aws_region" {
  description = "The AWS region to deploy the infrastructure"
  type        = string
}

variable "rds_proxy_endpoint" {
  description = "the rds proxy endpoint"
  type        = string
}

variable "lambda_log_retention" {
  description = "cloudwatch log retention setting"
  type    = number
}

variable "account_id" {
  description = "The AWS account ID"
  type        = string
}

variable "rds_proxy_resourceid" {
  description = "name resource id of the rds proxy for lambda policy;  e.g. prx-some-hash"
  type    = string
}

variable "lambda_secret_name" {
  description = "name of the secrets manager secret for lambda"
  type    = string
}

variable "lambda_secret_arn" {
  description = "arn of the secrets manager secret for lambda"
  type    = string
}

variable "admin_secret_name" {
  description = "name of the secrets manager secret for admin"
  type    = string
}

variable "admin_secret_arn" {
  description = "arn of the secrets manager secret for admin"
  type    = string 
}

variable "database_name" {
  description = "The name of the database to create"
  type        = string  
}

variable "random_string_id" {
  description = "Random string to append to resource names"
  type        = string
}