variable "user_pool_name" {}
variable "domain_prefix" {}
variable "callback_urls" { type = list(string) }
variable "logout_urls" { type = list(string) }
variable "auth0_metadata_url" {}
variable "random_string_id" {
  description = "Random string to append to resource names"
  type        = string
}
variable "default_redirect_uri" {
  description = "Default redirect URI for the Cognito user pool client"
  type        = string
}
