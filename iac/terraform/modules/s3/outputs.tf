output "bucket_name" {
  value = aws_s3_bucket.react_app.bucket
}

output "bucket_arn" {
  value = aws_s3_bucket.react_app.arn
}

output "bucket_website_endpoint" {
  value = aws_s3_bucket.react_app.website_endpoint
}
