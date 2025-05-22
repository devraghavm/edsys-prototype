resource "aws_s3_bucket" "static_website" {
  bucket = var.bucket_name
  force_destroy = true
  # acl is deprecated; permissions are managed via the bucket policy
  # acl    = "public-read"
}

resource "aws_s3_bucket_acl" "static_website_acl" {
  bucket = aws_s3_bucket.static_website.id
  acl    = "public-read"
}

resource "aws_s3_bucket_website_configuration" "static_site_bucket_website_config" {
  bucket = aws_s3_bucket.static_website.id

  index_document {
    suffix = "index.html"
  }
}

resource "null_resource" "my_frontend_buildstep" {
  triggers = {
    frontend_changes = "${base64sha256(join("", fileset("${path.module}/../../../../frontend", "**/*")))}"
  }

  provisioner "local-exec" {
    command = "${path.module}/../../../../frontend/build.sh"
  }
}

resource "aws_s3_object" "provision_source_files" {
  bucket = aws_s3_bucket.static_website.id

  # webfiles/ is the Directory contains files to be uploaded to S3
  for_each = fileset("${path.module}/../../frontend/src/", "**/*.*")

  key          = each.value
  source       = "${path.module}/../../frontend/src/${each.value}"
  content_type = each.value

  depends_on = [ null_resource.my_frontend_buildstep ]
}

resource "aws_s3_bucket_policy" "static_website_policy" {
  bucket = aws_s3_bucket.static_website.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "s3:GetObject"
        Effect    = "Allow"
        Resource  = "${aws_s3_bucket.static_website.arn}/*"
        Principal = "*"
      }
    ]
  })
}

resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.static_website.bucket_regional_domain_name
    origin_id   = "S3Origin"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.cdn_identity.id
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    target_origin_id = "S3Origin"

    viewer_protocol_policy = "redirect-to-https"
    allowed_methods       = ["GET", "HEAD"]
    cached_methods        = ["GET", "HEAD"]

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 31536000
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name = "StaticWebsiteCDN"
  }
}

resource "aws_cloudfront_origin_access_identity" "cdn_identity" {
  comment = "Origin Access Identity for S3 Static Website"
}