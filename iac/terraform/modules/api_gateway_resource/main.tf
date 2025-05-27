resource "aws_api_gateway_resource" "resource_prefix" {
  rest_api_id = var.api_gateway_id
  parent_id   = var.api_gateway_base_path_id
  path_part   = var.resource_prefix
}

# CORS for resource_prefix
resource "aws_api_gateway_method" "resource_prefix_options" {
  rest_api_id   = var.api_gateway_id
  resource_id   = aws_api_gateway_resource.resource_prefix.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "resource_prefix_options" {
  rest_api_id             = var.api_gateway_id
  resource_id             = aws_api_gateway_resource.resource_prefix.id
  http_method             = aws_api_gateway_method.resource_prefix_options.http_method
  type                    = "MOCK"
  integration_http_method = "OPTIONS"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "resource_prefix_options" {
  rest_api_id = var.api_gateway_id
  resource_id = aws_api_gateway_resource.resource_prefix.id
  http_method = aws_api_gateway_method.resource_prefix_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
  depends_on = [aws_api_gateway_method.resource_prefix_options]
}

resource "aws_api_gateway_integration_response" "resource_prefix_options" {
  rest_api_id = var.api_gateway_id
  resource_id = aws_api_gateway_resource.resource_prefix.id
  http_method = aws_api_gateway_method.resource_prefix_options.http_method
  status_code = aws_api_gateway_method_response.resource_prefix_options.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  depends_on = [aws_api_gateway_integration.resource_prefix_options]
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = var.api_gateway_id
  parent_id   = aws_api_gateway_resource.resource_prefix.id
  path_part   = "{proxy+}"
}

# CORS for proxy
resource "aws_api_gateway_method" "proxy_options" {
  rest_api_id   = var.api_gateway_id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "proxy_options" {
  rest_api_id             = var.api_gateway_id
  resource_id             = aws_api_gateway_resource.proxy.id
  http_method             = aws_api_gateway_method.proxy_options.http_method
  type                    = "MOCK"
  integration_http_method = "OPTIONS"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "proxy_options" {
  rest_api_id = var.api_gateway_id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
  depends_on = [aws_api_gateway_method.proxy_options]
}

resource "aws_api_gateway_integration_response" "proxy_options" {
  rest_api_id = var.api_gateway_id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy_options.http_method
  status_code = aws_api_gateway_method_response.proxy_options.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  depends_on = [aws_api_gateway_integration.proxy_options]
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = var.api_gateway_id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id             = var.api_gateway_id
  resource_id             = aws_api_gateway_resource.proxy.id
  http_method             = aws_api_gateway_method.proxy.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_function_invoke_arn
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_execution_arn}/*/*"
}
