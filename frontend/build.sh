#!/usr/bin/env bash

#  Change to the script directory 
cd "$(dirname "$0")"
npm install
npm run build
# Copy the dist directory, node_modules, and package.json to the iac/terraform src directory
if [ -d "../iac/terraform/frontend/src" ]; then
  rm -rf ../iac/terraform/frontend/src
fi
mkdir -p ../iac/terraform/frontend/src
cp -r dist/** ../iac/terraform/frontend/src
