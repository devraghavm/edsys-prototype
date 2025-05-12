output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.react_app.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.react_app.id
}

output "cloudfront_origin_access_identity_arn" {
  # This output provides the ARN of the CloudFront Origin Access Identity
  # which is used to grant CloudFront permission to access the S3 bucket.
  # This is useful for setting up the S3 bucket policy to allow access from CloudFront.
  # You can use this ARN in the S3 bucket policy to restrict access to only CloudFront.
  # This is important for security, as it prevents direct access to the S3 bucket from the internet.
  # The ARN format is typically: arn:aws:cloudfront::account-id:origin-access-identity/identity-id
  # where account-id is your AWS account ID and identity-id is the ID of the origin access identity.
  # Example: arn:aws:cloudfront::123456789012:origin-access-identity/E2QEXAMPLE
  # This output is useful for referencing the CloudFront Origin Access Identity in other resources or modules.
  # It can be used in the S3 bucket policy to allow access from CloudFront.
  # It can also be used in other modules or resources that require the ARN of the CloudFront Origin Access Identity.
  # This output is useful for debugging and verification purposes.
  # It allows you to verify that the CloudFront Origin Access Identity has been created successfully and is available for use.
  # It can also be used to verify that the ARN format is correct and matches the expected format.
  # This output is useful for auditing and compliance purposes.
  # It allows you to verify that the CloudFront Origin Access Identity is being used correctly and is not being misconfigured.
  # It can also be used to verify that the CloudFront Origin Access Identity is being used in accordance with security best practices.
  # This output is useful for monitoring and alerting purposes.
  # It allows you to monitor the usage of the CloudFront Origin Access Identity and alert on any changes or anomalies.
  # It can also be used to monitor the usage of the CloudFront Origin Access Identity and alert on any unauthorized access attempts.
  # This output is useful for reporting and documentation purposes.
  # It allows you to document the usage of the CloudFront Origin Access Identity and report on its usage.
  # It can also be used to document the usage of the CloudFront Origin Access Identity and report on its compliance with security best practices.
  # This output is useful for integration with other tools and services.
  # It allows you to integrate the CloudFront Origin Access Identity with other tools and services that require the ARN of the CloudFront Origin Access Identity.       
  value = aws_cloudfront_origin_access_identity.react_app.arn
}
