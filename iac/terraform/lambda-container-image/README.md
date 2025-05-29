# Lambda Container Image

This project contains a Node.js Lambda function packaged as a Docker container. The following instructions will guide you through building the Docker image and pushing it to the Amazon ECR repository.

## Project Structure

```
lambda-container-image
├── Dockerfile
├── index.js
├── package.json
└── README.md
```

## Prerequisites

- AWS CLI installed and configured with appropriate permissions.
- Docker installed on your machine.
- An Amazon ECR repository created for this project.

## Building the Docker Image

1. Navigate to the project directory:

   ```
   cd lambda-container-image
   ```

2. Build the Docker image using the following command:

   ```
   docker build -t <your-ecr-repo-name>:<tag> .
   ```

   Replace `<your-ecr-repo-name>` with the name of your ECR repository and `<tag>` with your desired image tag (e.g., `latest`).

## Authenticating Docker to ECR

Before pushing the image, authenticate Docker to your ECR registry:

```
aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.<your-region>.amazonaws.com
```

Replace `<your-region>` and `<your-account-id>` with your AWS region and account ID.

## Pushing the Docker Image to ECR

After building the image, push it to your ECR repository:

```
docker push <your-ecr-repo-name>:<tag>
```

## Deploying the Lambda Function

Once the image is pushed to ECR, you can create or update your AWS Lambda function to use this container image.

## License

This project is licensed under the MIT License.