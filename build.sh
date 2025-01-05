#!/bin/bash

# Install dependencies
npm install

# Set Node options to disable experimental fetch
export NODE_OPTIONS="--no-experimental-fetch"

# Create web-build directory if it doesn't exist
mkdir -p web-build

# Run the build command
npm run build

# Install serve globally
npm install -g serve