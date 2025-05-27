#!/usr/bin/env bash

#  Change to the script directory 
cd "$(dirname "$0")"
npm run build
# Install node-prune if not already installed
if ! command -v node-prune &> /dev/null
then
    echo "node-prune could not be found, installing..."
    curl -sf https://gobinaries.com/tj/node-prune | sh
fi
npm run install:prod && npm run prune_me
# Copy the dist directory, node_modules, and package.json to the iac/terraform src directory
if [ -d "../iac/terraform/backend/src" ]; then
  rm -rf ../iac/terraform/backend/src
fi
mkdir -p ../iac/terraform/backend/src
cp -r dist/** ../iac/terraform/backend/src
cp -r node_modules ../iac/terraform/backend/src
cp package*.json ../iac/terraform/backend/src
