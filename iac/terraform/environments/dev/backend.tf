terraform {
  backend "s3" {
    bucket       = "edsys-infra-d-terraform"
    key          = "terraform/state/dev.tfstate"
    region       = "us-east-1"
    use_lockfile = true
  }
}
