terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "6.27.0"
    }
     doppler = {
      source = "DopplerHQ/doppler"
    }
  }

  backend "remote" {
    organization = "hatohui" 

    workspaces { 
      name = "yaoyao" 
    } 
  }
}