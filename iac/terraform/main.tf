module "s3" {
  source             = "./modules/s3"
  bucket_name        = "your-react-app-bucket-name"
  cloudfront_oai_arn = module.cloudfront.cloudfront_oai_arn
  tags = {
    Name        = "ReactAppBucket"
    Environment = "Production"
  }
}

module "cloudfront" {
  source                     = "./modules/cloudfront"
  s3_bucket_name             = module.s3.bucket_name
  s3_bucket_website_endpoint = module.s3.bucket_website_endpoint
  tags = {
    Name        = "ReactAppCloudFront"
    Environment = "Production"
  }
}
