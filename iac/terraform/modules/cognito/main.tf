resource "aws_cognito_user_pool" "this" {
  name = var.user_pool_name

  schema {
    name                = "upn"
    attribute_data_type = "String"
    mutable             = true
    required            = false
    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_domain" "this" {
  domain       = "${var.domain_prefix}-${lower(var.random_string_id)}"
  user_pool_id = aws_cognito_user_pool.this.id
}

resource "aws_cognito_user_pool_client" "this" {
  name         = "${var.user_pool_name}-client"
  user_pool_id = aws_cognito_user_pool.this.id

  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["openid", "profile"]
  allowed_oauth_flows_user_pool_client = true
  callback_urls                        = var.callback_urls
  default_redirect_uri                 = var.default_redirect_uri
  logout_urls                          = var.logout_urls
  supported_identity_providers         = [aws_cognito_identity_provider.auth0.provider_name]
  generate_secret                      = false
  enable_token_revocation              = true
  explicit_auth_flows = [
    # "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_CUSTOM_AUTH",
  ]
}

resource "aws_cognito_identity_provider" "auth0" {
  user_pool_id  = aws_cognito_user_pool.this.id
  provider_name = "Auth0"
  provider_type = "SAML"

  provider_details = {
    MetadataFile = file("${path.module}/dev-3aahjweqk1prrzuf_us_auth0_com-metadata.xml")
    IDPSignout   = "true"
  }

  attribute_mapping = {
    "custom:upn" = "upn"
    "email"      = "email"
    "username"   = "user_id"
  }

  lifecycle {
    ignore_changes = [
      provider_details["ActiveEncryptionCertificate"] # adding because of this bug: https://github.com/hashicorp/terraform-provider-aws/issues/35588
    ]
  }
}
