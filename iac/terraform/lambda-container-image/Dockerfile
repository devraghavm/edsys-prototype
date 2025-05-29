FROM public.ecr.aws/lambda/nodejs:22

# Copy the function code
COPY index.js package.json ./

# Install dependencies
RUN npm install

# Command to run the Lambda function
CMD ["index.handler"]