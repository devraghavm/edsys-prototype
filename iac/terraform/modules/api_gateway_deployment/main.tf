resource "aws_api_gateway_deployment" "this" {
  rest_api_id = var.api_gateway_id
}

resource "aws_api_gateway_stage" "stage" {
  rest_api_id   = var.api_gateway_id
  deployment_id = aws_api_gateway_deployment.this.id
  stage_name    = var.api_stage
}
