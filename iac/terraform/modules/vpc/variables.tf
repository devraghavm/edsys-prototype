variable "app_name" {
  description = "The name of the application"
  type        = string
}

variable "environment" {
  description = "The environment for the application (e.g., dev, staging, prod)"
  type        = string
}
variable "aws_region" {
  description = "The AWS region to deploy the infrastructure"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the vpc"
  type        = string
}

variable "public_cidr" {
  description = "values for public subnets"
  type        = list(any)
}

variable "app_cidr" {
  description = "values for app subnets"
  type        = list(any)
}

variable "db_cidr" {
  description = "values for db subnets"
  type        = list(any)
}

variable "azs" {
  description = "values for availability zones"
  type        = list(any)
}

variable "db_azs" {
  description = "values for db availability zones"
  type        = list(any)
}
