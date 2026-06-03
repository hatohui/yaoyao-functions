data "archive_file" "lambda_placeholder" {
  type        = "zip"
  output_path = "${path.module}/lambda_placeholder.zip"

  source {
    content  = "placeholder"
    filename = "bootstrap"
  }
}

resource "aws_lambda_function" "yaoyao_function" {
  function_name = var.function_name
  role          = aws_iam_role.yaoyao_lambda_role.arn
  handler       = "bootstrap"
  runtime       = "provided.al2023"
  timeout       = 10
  memory_size   = 512

  filename         = data.archive_file.lambda_placeholder.output_path
  source_code_hash = data.archive_file.lambda_placeholder.output_base64sha256

  layers = ["arn:aws:lambda:${var.aws_region}:753240598075:layer:LambdaAdapterLayerX86:25"]

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }

  environment {
    variables = {
      PORT     = "8080"
      NODE_ENV = "production"

      DATABASE_URL = local.doppler_database_url
      REDIS_URL    = local.doppler_redis_url

      BUCKET_NAME                  = local.doppler_bucket_name
      CLOUDFLARE_ACCOUNT_ID        = local.doppler_cloudflare_account_id
      CLOUDFLARE_API_TOKEN         = local.doppler_cloudflare_api_token
      CLOUDFLARE_ACCESS_KEY_ID     = local.doppler_cloudflare_access_key
      CLOUDFLARE_SECRET_ACCESS_KEY = local.doppler_cloudflare_secret_key
    }
  }

  tags = {
    Name        = var.function_name
    Environment = "production"
  }
}

resource "aws_lambda_function_url" "yaoyao_function_url" {
  function_name      = aws_lambda_function.yaoyao_function.function_name
  authorization_type = "AWS_IAM"
}

resource "aws_lambda_permission" "allow_cloudfront" {
  statement_id  = "AllowCloudFrontInvoke"
  action        = "lambda:InvokeFunctionUrl"
  function_name = aws_lambda_function.yaoyao_function.function_name
  principal     = "cloudfront.amazonaws.com"
  source_arn    = aws_cloudfront_distribution.main.arn
}
