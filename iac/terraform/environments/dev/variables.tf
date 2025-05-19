variable "aws_region" {
  description = "The AWS region to deploy the infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the vpc"
  type    = string
  default = "10.0.0.0/16"
}

variable "public_cidr" {
  description = "values for public subnets"
	type = list
	default = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "app_cidr" {
  description = "values for app subnets"
	type = list
	default = ["10.0.21.0/24", "10.0.22.0/24"]
}

variable "db_cidr" {
  description = "values for db subnets"
	type = list
	default = ["10.0.31.0/24", "10.0.32.0/24", "10.0.33.0/24"]
}

variable "azs" {
  description = "values for availability zones"
	type = list
	default = ["us-east-1a", "us-east-1b"]
}

variable "db_azs" {
  description = "values for db availability zones"
	type = list
	default = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "cluster_identifier" {
  description = "The identifier for the RDS cluster"
  type = string
  default = "edsys-aurora-mysql-cluster"
}

variable "db_instance_class" {
  description = "The instance class for the RDS database."
  type        = string
  default     = "db.serverless"
}

variable "db_engine" {
  description = "The database engine to use."
  type        = string
  default     = "aurora-mysql"
}

variable "db_engine_version" {
  description = "The version of the database engine."
  type        = string
  default     = "8.0.mysql_aurora.3.02.0"
}

variable "username" {
  description = "Username for the RDS database"
	type = string
	default = "lambda"
}

variable "ami_id" {
  description = "AMI ID for the Lambda function"
	type = string
	default = "ami-04999cd8f2624f834"
}

variable "rds_proxy_name" {
  description = "Name of the RDS proxy"
	type = string
	default = "test-aurora-mysql"
}

variable "log_retention" {
  description = "log retention in days"
  type = number
  default = 7
}

variable "bucket_name" {
  description = "name of the s3 bucket"
  type    = string
  default = "lambda-rdsproxy"
}

variable "lambda_log_retention" {
  description = "cloudwatch log retention setting"
  type    = number
  default = 7
}

variable "database_name" {
  description = "The name of the database to create"
  type        = string  
  default     = "products"
}

variable "static_website_s3_bucket_name" {
  description = "name of the s3 bucket for static website"
  type    = string
  default = "devraghavm-static-website-bucket-d"
}