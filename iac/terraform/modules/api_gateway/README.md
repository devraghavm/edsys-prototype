# API Gateway Module Documentation

## Overview

The API Gateway module provisions an AWS API Gateway that serves as a front door for your application, allowing you to create, publish, maintain, monitor, and secure APIs at any scale. This module is designed to work seamlessly with AWS Lambda functions, enabling you to build serverless applications.

## Features

- Creates an API Gateway with VPC Link integration.
- Configures routes to connect to the specified Lambda function.
- Supports various HTTP methods for API endpoints.

## Usage

To use this module, include it in your Terraform configuration as follows:

```hcl
module "api_gateway" {
  source          = "../modules/api_gateway"
  lambda_function_arn = module.lambda.lambda_function_arn
  # Add other necessary variables here
}
```

## Input Variables

| Variable                     | Description                                           | Type   | Default | Required |
|------------------------------|-------------------------------------------------------|--------|---------|----------|
| lambda_function_arn          | The ARN of the Lambda function to integrate with API Gateway. | string | n/a     | yes      |
| api_name                     | The name of the API Gateway.                          | string | "MyAPI" | no       |
| api_stage                    | The deployment stage for the API (e.g., dev, prod). | string | "dev"   | no       |

## Outputs

| Output                       | Description                                           |
|------------------------------|-------------------------------------------------------|
| api_gateway_endpoint          | The endpoint URL of the API Gateway.                  |
| api_gateway_id               | The ID of the created API Gateway.                    |

## Example

Here is an example of how to call this module:

```hcl
module "api_gateway" {
  source                = "../modules/api_gateway"
  lambda_function_arn   = module.lambda.lambda_function_arn
  api_name              = "MyApplicationAPI"
  api_stage             = "v1"
}
```

## Notes

- Ensure that the Lambda function is deployed before creating the API Gateway.
- Adjust the input variables as necessary to fit your application's requirements.

## License

This module is open-source and available for use under the MIT License.