variable "app_name" {
  description = "The name of the application"
  type        = string
}

variable "aws_region" {
  description = "The AWS region to deploy the infrastructure"
  type        = string
}

variable "account_id" {
  description = "The AWS account ID"
  type        = string
}

variable "cluster_identifier" {
  description = "The name of the RDS cluster"
  type        = string
}

variable "db_azs" {
  description = "values for db availability zones"
  type        = list(any)
}

variable "db_instance_class" {
  description = "The instance class for the RDS database."
  type        = string
}

variable "db_engine" {
  description = "The database engine to use."
  type        = string
}

variable "db_engine_version" {
  description = "The version of the database engine."
  type        = string
}


variable "username" {
  description = "Username for the RDS database"
  type        = string
}

variable "rds_proxy_name" {
  description = "Name of the RDS proxy"
  type        = string
}

variable "log_retention" {
  description = "log retention in days"
  type        = number
}

variable "database_name" {
  description = "The name of the database to create"
  type        = string
}

variable "db_subnet_ids" {
  description = "List of subnet IDs for the RDS database"
  type        = list(string)
}

variable "app_subnet_ids" {
  description = "List of subnet IDs for the application"
  type        = list(string)
}

variable "security_group_ids" {
  description = "List of security group IDs for the RDS database"
  type        = map(string)
}

variable "random_string_id" {
  description = "Random string to append to resource names"
  type        = string
}

variable "rds_prefix" {
  description = "Prefix for the RDS names"
  type        = string
}

variable "aws_db_subnet_group_id" {
  description = "The ID of the DB subnet group"
  type        = string
}
