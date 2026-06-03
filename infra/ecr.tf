resource "aws_ecr_repository" "lambda" {
  name                 = var.function_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_lifecycle_policy" "lambda" {
  repository = aws_ecr_repository.lambda.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire untagged images after 1 day"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 1
        }
        action = { type = "expire" }
      },
      {
        rulePriority = 2
        description  = "Keep only the most recent image"
        selection = {
          tagStatus   = "tagged"
          tagPrefixList = ["latest"]
          countType   = "imageCountMoreThan"
          countNumber = 1
        }
        action = { type = "expire" }
      }
    ]
  })
}

resource "aws_ecr_repository_policy" "lambda" {
  repository = aws_ecr_repository.lambda.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "LambdaECRImageRetrievalPolicy"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      Action = [
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer"
      ]
    }]
  })
}
