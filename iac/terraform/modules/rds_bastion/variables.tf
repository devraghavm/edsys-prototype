variable "ami_id" {
  description = "AMI ID for the Lambda function"
  type        = string
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

variable "ec2_user_data" {
  description = "User data script for the EC2 instance"
  type        = string
  default     = ""
}

variable "rds_prefix" {
  description = "Prefix for the RDS names"
  type        = string
}
