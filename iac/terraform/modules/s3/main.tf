resource "aws_s3_bucket" "react_app" {
  bucket = var.bucket_name
  # Public access settings are now managed using aws_s3_bucket_public_access_block
  force_destroy = true

  # Website configuration is now managed using aws_s3_bucket_website_configuration

  tags = var.tags
}

resource "aws_s3_bucket_public_access_block" "react_app_public_access" {
  bucket = aws_s3_bucket.react_app.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_website_configuration" "react_app_website" {
  bucket = aws_s3_bucket.react_app.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_policy" "react_app_policy" {
  bucket = aws_s3_bucket.react_app.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          "AWS" : var.cloudfront_oai_arn
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.react_app.arn}/*"
      }
    ]
  })
}
