variable "vpc_cidr" {
  description = "CIDR block for the vpc"
  type    = string
}

variable "public_cidr" {
  description = "values for public subnets"
	type = list
}

variable "app_cidr" {
  description = "values for app subnets"
	type = list
}

variable "db_cidr" {
  description = "values for db subnets"
	type = list
}

variable "azs" {
  description = "values for availability zones"
	type = list
}

variable "db_azs" {
  description = "values for db availability zones"
	type = list
}