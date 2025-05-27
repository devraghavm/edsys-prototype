variable "app_name" {
  description = "The name of the application"
  type        = string
}

variable "bucket_name" {
  description = "The name of the S3 bucket for static website hosting."
  type        = string
}

variable "cloudfront_enabled" {
  description = "Enable or disable CloudFront distribution."
  type        = bool
  default     = true
}

variable "cloudfront_price_class" {
  description = "The price class for CloudFront distribution."
  type        = string
  default     = "PriceClass_All"
}

variable "s3_website_index_document" {
  description = "The index document for the S3 static website."
  type        = string
  default     = "index.html"
}

variable "s3_website_error_document" {
  description = "The error document for the S3 static website."
  type        = string
  default     = "error.html"
}

variable "cloudfront_certificate_arn" {
  description = "The ARN of the SSL certificate for CloudFront."
  type        = string
  default     = ""
}

variable "cloudfront_origin_access_identity" {
  description = "The CloudFront origin access identity."
  type        = string
  default     = ""
}
