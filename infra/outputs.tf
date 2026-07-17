output "function_url" {
  description = "Lambda Function URL"
  value       = aws_lambda_function_url.yaoyao_function_url.function_url
}

output "function_arn" {
  description = "Lambda Function ARN"
  value       = aws_lambda_function.yaoyao_function.arn
}

output "cloudfront_url" {
  description = "CloudFront Distribution URL"
  value       = "https://${aws_cloudfront_distribution.main.domain_name}"
}

output "cloudfront_distribution_arn" {
  description = "CloudFront Distribution ARN"
  value       = aws_cloudfront_distribution.main.arn
}


output "ecr_repository_url" {
  description = "ECR Repository URL"
  value       = aws_ecr_repository.lambda.repository_url
}