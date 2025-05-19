data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
}

resource "random_string" "random" {
  length           = 6
  special          = false
}

module "vpc" {
  source = "../../modules/vpc"

  vpc_cidr = var.vpc_cidr
  azs = var.azs
  db_azs = var.db_azs
  public_cidr = var.public_cidr
  db_cidr = var.db_cidr
  app_cidr = var.app_cidr
}

module "rds" {
  source = "../../modules/rds"

  cluster_identifier = var.cluster_identifier
  username = var.username
  db_engine = var.db_engine
  db_engine_version = var.db_engine_version
  db_instance_class = var.db_instance_class
  aws_region = var.aws_region
  db_azs = var.db_azs
  log_retention = var.log_retention
  rds_proxy_name = var.rds_proxy_name
  ami_id = var.ami_id
  account_id = local.account_id
  database_name = var.database_name
  app_subnet_ids = module.vpc.app_subnet_ids
  db_subnet_ids = module.vpc.db_subnet_ids
  security_group_ids = module.vpc.security_group_ids
  random_string_id = random_string.random.id

  depends_on = [ module.vpc ]
}

module "lambda" {
  source = "../../modules/lambda"

  aws_region = var.aws_region
  database_name = var.database_name
  lambda_secret_arn = module.rds.lambda_secret_arn
  lambda_secret_name = module.rds.lambda_secret_name
  account_id = local.account_id
  rds_proxy_resourceid = split("/", module.rds.rds_proxy_arn)[1]
  bucket_name = var.bucket_name
  rds_proxy_endpoint = module.rds.rds_proxy_endpoint
  lambda_log_retention = var.lambda_log_retention
  vpc_subnets = [module.vpc.lambda_subnet_1, module.vpc.lambda_subnet_2]
  security_group = module.vpc.security_group_ids.lambda_sg
  random_string_id = random_string.random.id

  depends_on = [ module.vpc, module.rds ]
}

module "api_gateway" {
  source = "../../modules/api_gateway"

  lambda_function_arn = module.lambda.lambda_function_arn
  lambda_function_invoke_arn = module.lambda.lambda_function_invoke_arn
  lambda_log_retention = var.lambda_log_retention
  rds_proxy_function_name = module.lambda.lambda_function_name

  depends_on = [ module.lambda ]
}

module "s3_cloudfront" {
  source = "../../modules/s3_cloudfront"

  bucket_name = var.static_website_s3_bucket_name

  depends_on = [ module.api_gateway ]
  
}

