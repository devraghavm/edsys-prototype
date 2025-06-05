# output "aws_api_gateway_deployment" {
#   description = "URL for API Gateway deployment"
#   value       = module.aws_api_gateway_deployment.api_gateway_invoke_url
# }

# output "feature_lambda_function_log" {
#   value = module.feature_lambda.lambda_function_log
# }

# output "admin_lambda_function_log" {
#   value = module.admin_lambda.lambda_function_log
# }

# output "feature_aws_ecr_repository_url" {
#   description = "The URL of the ECR repository for the feature Lambda function"
#   value       = module.feature_lambda.aws_ecr_repository_url
# }

# output "admin_aws_ecr_repository_url" {
#   description = "The URL of the ECR repository for the admin Lambda function"
#   value       = module.admin_lambda.aws_ecr_repository_url
# }

output "cognito_user_pool_id" {
  value = module.cognito.user_pool_id
}

output "cognito_user_pool_client_id" {
  value = module.cognito.user_pool_client_id
}

output "cognito_user_pool_domain" {
  value = module.cognito.user_pool_domain
}

# output "cloudfront_distribution_id" {
#   value = module.s3_cloudfront.cloudfront_distribution_id
# }

# output "cloudfront_domain_name" {
#   value = module.s3_cloudfront.cloudfront_domain_name
# }
