variable "doppler_token" {
  description = "Doppler auth token"
  type        = string
  sensitive   = true
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "function_name" {
  description = "Lambda function name"
  type        = string
  default     = "yaoyao-function"
}


variable "domain_name" {
  description = "Custom domain name for CloudFront (must match the ACM certificate)"
  type        = string
  default     = "api.yaoyaodinner.party"
}

variable "doppler_project" {
  description = "Doppler project name"
  type        = string
  default     = "yaoyaodinner"
}

variable "doppler_config" {
  description = "Doppler config name"
  type        = string
  default     = "ci"
}
