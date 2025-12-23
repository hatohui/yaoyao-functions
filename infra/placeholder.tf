# Create a placeholder zip file for initial Lambda creation
# The actual code is updated via AWS CLI in the GitHub Actions workflow

data "archive_file" "lambda_placeholder" {
  type        = "zip"
  output_path = "${path.module}/.terraform/placeholder.zip"

  source {
    content  = "exports.handler = async (event) => ({ statusCode: 200, body: 'Placeholder' });"
    filename = "index.js"
  }
}
