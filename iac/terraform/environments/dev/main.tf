data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
}

resource "random_string" "random" {
  length  = 6
  special = false
}

module "vpc" {
  source = "../../modules/vpc"

  app_name    = var.app_name
  environment = var.environment
  vpc_cidr    = var.vpc_cidr
  azs         = var.azs
  db_azs      = var.db_azs
  public_cidr = var.public_cidr
  db_cidr     = var.db_cidr
  app_cidr    = var.app_cidr
  aws_region  = var.aws_region
}

module "feature_rds" {
  source = "../../modules/rds"

  cluster_identifier     = "${var.app_name}-${var.db_engine}-${var.environment}-feature-cluster"
  app_name               = var.app_name
  rds_prefix             = "feature"
  username               = var.username
  db_engine              = var.db_engine
  db_engine_version      = var.db_engine_version
  db_instance_class      = var.db_instance_class
  aws_region             = var.aws_region
  db_azs                 = var.db_azs
  log_retention          = var.log_retention
  rds_proxy_name         = "${var.app_name}-${var.db_engine}-${var.environment}-feature-rds-proxy"
  account_id             = local.account_id
  database_name          = var.feature_database_name
  app_subnet_ids         = module.vpc.app_subnet_ids
  db_subnet_ids          = module.vpc.db_subnet_ids
  security_group_ids     = module.vpc.security_group_ids
  random_string_id       = random_string.random.id
  aws_db_subnet_group_id = module.vpc.aws_db_subnet_group_id

  depends_on = [module.vpc]
}

module "feature_rds_bastion" {
  source = "../../modules/rds_bastion"

  ami_id             = var.ami_id
  security_group_ids = module.vpc.security_group_ids
  app_subnet_ids     = module.vpc.app_subnet_ids
  random_string_id   = random_string.random.id
  rds_prefix         = "feature"
  ec2_user_data      = <<EOF
#!/bin/bash

sudo dnf -y update
sudo dnf -y localinstall https://dev.mysql.com/get/mysql80-community-release-el9-4.noarch.rpm
sudo dnf -y install mysql mysql-community-client

mysql -u admin -p'${module.feature_rds.admin_password}' -h '${module.feature_rds.cluster_instance_endpoint}' <<MY_QUERY
CREATE USER '${var.username}'@'%' IDENTIFIED BY '${module.feature_rds.lambda_password}';
CREATE DATABASE IF NOT EXISTS ${var.feature_database_name};
GRANT SELECT, INSERT, UPDATE, DELETE ON ${var.feature_database_name}.* TO '${var.username}';
FLUSH PRIVILEGES;
USE \`${var.feature_database_name}\`;
CREATE TABLE IF NOT EXISTS \`product\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`title\` varchar(191) NOT NULL,
  \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
);
SHOW TABLES;
MY_QUERY

echo done
EOF

  depends_on = [module.feature_rds]
}

module "feature_lambda" {
  source = "../../modules/lambda"

  app_name                   = var.app_name
  lambda_function_name       = "feature"
  aws_region                 = var.aws_region
  database_name              = var.feature_database_name
  lambda_secret_arn          = module.feature_rds.lambda_secret_arn
  lambda_secret_name         = module.feature_rds.lambda_secret_name
  admin_secret_arn           = module.feature_rds.admin_secret_arn
  admin_secret_name          = module.feature_rds.admin_secret_name
  account_id                 = local.account_id
  rds_proxy_resourceid       = split(":", module.feature_rds.rds_proxy_arn)[length(split(":", module.feature_rds.rds_proxy_arn)) - 1]
  lambda_image_tag           = var.lambda_image_tag
  rds_proxy_endpoint         = module.feature_rds.rds_proxy_endpoint
  lambda_log_retention       = var.lambda_log_retention
  vpc_subnets                = [module.vpc.lambda_subnet_1, module.vpc.lambda_subnet_2]
  security_group             = module.vpc.security_group_ids.lambda_sg
  random_string_id           = random_string.random.id
  lambda_image_build_context = "${path.module}/../../lambda-container-image"
  aws_profile                = "default"

  depends_on = [module.vpc, module.feature_rds, module.feature_rds_bastion]
}


module "admin_rds" {
  source = "../../modules/rds"

  cluster_identifier     = "${var.app_name}-${var.db_engine}-${var.environment}-admin-cluster"
  app_name               = var.app_name
  rds_prefix             = "admin"
  username               = var.username
  db_engine              = var.db_engine
  db_engine_version      = var.db_engine_version
  db_instance_class      = var.db_instance_class
  aws_region             = var.aws_region
  db_azs                 = var.db_azs
  log_retention          = var.log_retention
  rds_proxy_name         = "${var.app_name}-${var.db_engine}-${var.environment}-admin-rds-proxy"
  account_id             = local.account_id
  database_name          = var.admin_database_name
  app_subnet_ids         = module.vpc.app_subnet_ids
  db_subnet_ids          = module.vpc.db_subnet_ids
  security_group_ids     = module.vpc.security_group_ids
  random_string_id       = random_string.random.id
  aws_db_subnet_group_id = module.vpc.aws_db_subnet_group_id

  depends_on = [module.vpc]
}

module "admin_rds_bastion" {
  source = "../../modules/rds_bastion"

  ami_id             = var.ami_id
  security_group_ids = module.vpc.security_group_ids
  app_subnet_ids     = module.vpc.app_subnet_ids
  random_string_id   = random_string.random.id
  rds_prefix         = "admin"
  ec2_user_data      = <<EOF
#!/bin/bash

sudo dnf -y update
sudo dnf -y localinstall https://dev.mysql.com/get/mysql80-community-release-el9-4.noarch.rpm
sudo dnf -y install mysql mysql-community-client

mysql -u admin -p'${module.admin_rds.admin_password}' -h '${module.admin_rds.cluster_instance_endpoint}' <<MY_QUERY
CREATE USER '${var.username}'@'%' IDENTIFIED BY '${module.admin_rds.lambda_password}';
CREATE DATABASE IF NOT EXISTS ${var.admin_database_name};
GRANT SELECT, INSERT, UPDATE, DELETE ON ${var.admin_database_name}.* TO '${var.username}';
FLUSH PRIVILEGES;
USE \`${var.admin_database_name}\`;
drop table if exists archive_user_roles;
drop table if exists archive_roles;
drop table if exists archive_user_details;

CREATE TABLE IF NOT EXISTS archive_user_details (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(50),
    UNIQUE (user_name)
);

CREATE TABLE IF NOT EXISTS archive_roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    role_desc VARCHAR(255) NOT NULL,
    priority TINYINT NOT NULL
);

CREATE TABLE IF NOT EXISTS archive_user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id , role_id),
    FOREIGN KEY (user_id)
        REFERENCES archive_user_details (user_id)
        ON UPDATE RESTRICT ON DELETE CASCADE,
    FOREIGN KEY (role_id)
        REFERENCES archive_roles (role_id)
        ON UPDATE RESTRICT ON DELETE CASCADE
);
SHOW TABLES;
MY_QUERY

echo done
EOF

  depends_on = [module.admin_rds]
}

module "admin_lambda" {
  source = "../../modules/lambda"

  app_name                   = var.app_name
  lambda_function_name       = "admin"
  aws_region                 = var.aws_region
  database_name              = var.admin_database_name
  lambda_secret_arn          = module.admin_rds.lambda_secret_arn
  lambda_secret_name         = module.admin_rds.lambda_secret_name
  admin_secret_arn           = module.admin_rds.admin_secret_arn
  admin_secret_name          = module.admin_rds.admin_secret_name
  account_id                 = local.account_id
  rds_proxy_resourceid       = split(":", module.admin_rds.rds_proxy_arn)[length(split(":", module.admin_rds.rds_proxy_arn)) - 1]
  lambda_image_tag           = var.lambda_image_tag
  rds_proxy_endpoint         = module.admin_rds.rds_proxy_endpoint
  lambda_log_retention       = var.lambda_log_retention
  vpc_subnets                = [module.vpc.lambda_subnet_1, module.vpc.lambda_subnet_2]
  security_group             = module.vpc.security_group_ids.lambda_sg
  random_string_id           = random_string.random.id
  lambda_image_build_context = "${path.module}/../../lambda-container-image"
  aws_profile                = "default"

  depends_on = [module.vpc, module.admin_rds, module.admin_rds_bastion]
}

module "api_gateway" {
  source = "../../modules/api_gateway"

  app_name             = var.app_name
  lambda_log_retention = var.lambda_log_retention
  base_path            = "api"

  depends_on = [module.feature_lambda]
}

module "aws_api_gateway_feature_resource" {
  source = "../../modules/api_gateway_resource"

  app_name                   = var.app_name
  api_gateway_id             = module.api_gateway.api_gateway_id
  lambda_function_name       = module.feature_lambda.lambda_function_name
  lambda_function_invoke_arn = module.feature_lambda.lambda_function_invoke_arn
  resource_prefix            = "feature"
  api_gateway_execution_arn  = module.api_gateway.api_gateway_execution_arn
  lambda_function_arn        = module.feature_lambda.lambda_function_arn
  api_gateway_base_path_id   = module.api_gateway.api_gateway_base_path_id

  depends_on = [module.api_gateway]
}

module "aws_api_gateway_admin_resource" {
  source = "../../modules/api_gateway_resource"

  app_name                   = var.app_name
  api_gateway_id             = module.api_gateway.api_gateway_id
  lambda_function_name       = module.admin_lambda.lambda_function_name
  lambda_function_invoke_arn = module.admin_lambda.lambda_function_invoke_arn
  resource_prefix            = "admin"
  api_gateway_execution_arn  = module.api_gateway.api_gateway_execution_arn
  lambda_function_arn        = module.admin_lambda.lambda_function_arn
  api_gateway_base_path_id   = module.api_gateway.api_gateway_base_path_id

  depends_on = [module.api_gateway]
}

module "aws_api_gateway_deployment" {
  source = "../../modules/api_gateway_deployment"

  api_gateway_id = module.api_gateway.api_gateway_id
  api_stage      = var.environment

  depends_on = [module.aws_api_gateway_feature_resource, module.aws_api_gateway_admin_resource]
}

# module "s3_cloudfront" {
#   source = "../../modules/s3_cloudfront"

#   bucket_name = var.static_website_s3_bucket_name

#   depends_on = [ module.api_gateway ]

# }

