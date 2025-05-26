# Stage 1: Build the application
FROM node:22 AS builder
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run install:prod && npm run prune_me

# Use the AWS Lambda base image for Node.js
FROM public.ecr.aws/lambda/nodejs:22
# Set the working directory in the container
WORKDIR ${LAMBDA_TASK_ROOT}
# Copy files from the builder stage
COPY --from=builder /app/package*.json ${LAMBDA_TASK_ROOT}/
COPY --from=builder /app/dist/ ${LAMBDA_TASK_ROOT}/dist/
COPY --from=builder /app/node_modules ${LAMBDA_TASK_ROOT}/node_modules/
# Set the Lambda function handler
CMD ["dist/lambda.handler"]