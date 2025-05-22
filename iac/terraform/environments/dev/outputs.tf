output "apigwy_url" {
  description = "URL for API Gateway"

  value = module.api_gateway.apigwy_url
}

output "lambda_function_log" {
  value = module.lambda.lambda_function_log
}

# output "cloudfront_distribution_id" {
#   value = module.s3_cloudfront.cloudfront_distribution_id
# }

# output "cloudfront_domain_name" {
#   value = module.s3_cloudfront.cloudfront_domain_name
# }