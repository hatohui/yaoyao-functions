provider "aws" {
  region = var.aws_region
}

provider "doppler" {
  doppler_token = var.doppler_token
}