variable "s3_bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
}

variable "s3_bucket_website_endpoint" {
  description = "The website endpoint of the S3 bucket"
  type        = string
}

variable "tags" {
  description = "Tags to apply to the CloudFront distribution"
  type        = map(string)
}
