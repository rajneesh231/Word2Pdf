#!/bin/bash

# This script builds and runs the Docker container locally

# Pull the prebuilt Docker image
docker pull rajneesh768/word2pdf

# Run the container (expose port 3000)
docker run -d -p 3000:3000 rajneesh768/word2pdf
echo "Container Started"
echo "Server Running on port 3000"