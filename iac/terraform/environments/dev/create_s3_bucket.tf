# resource "aws_s3_bucket" "private_bucket" {
#   bucket = "edsys-infra-d-terraform"
# }

# resource "aws_s3_bucket_public_access_block" "private_bucket_public_access_block" {
#   bucket = aws_s3_bucket.private_bucket.id

#   block_public_acls     = true
#   block_public_policy   = true
#   ignore_public_acls    = true
#   restrict_public_buckets = true
# }

# resource "aws_s3_bucket_versioning" "private_bucket_versioning" {
#   bucket = aws_s3_bucket.private_bucket.id
#   versioning_configuration {
#     status = "Enabled"
#   }
# }