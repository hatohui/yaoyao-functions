# CloudFront Origin Access Control for Lambda Function URL
resource "aws_cloudfront_origin_access_control" "lambda_oac" {
  name                              = "${var.function_name}-oac"
  description                       = "Origin Access Control for ${var.function_name} Lambda Function URL"
  origin_access_control_origin_type = "lambda"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}
