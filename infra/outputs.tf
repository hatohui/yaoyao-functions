output "function_url" {
  description = "Lambda Function URL"
  value       = aws_lambda_function_url.yaoyao_function_url.function_url
}

output "api_endpoint" {
  description = "API Endpoint URL (with /api path)"
  value       = "${aws_lambda_function_url.yaoyao_function_url.function_url}api"
}

output "function_arn" {
  description = "Lambda Function ARN"
  value       = aws_lambda_function.yaoyao_function.arn
}