#!/bin/bash

# This script builds and runs the Docker container locally
echo "Your Application is starting."
echo "Please be Patient, this could take a few minutes if the Image is not present on your system."
# Pull the prebuilt Docker image
docker pull rajneesh768/word2pdf >/dev/null 2>&1

# Run the container (expose port 3000) in detached mode, suppress all output
docker run -d -p 3000:3000 rajneesh768/word2pdf >/dev/null 2>&1

# Check if the docker run command was successful
if [ $? -eq 0 ]; then
  echo "Container Started"
  echo "Server Running on port 3000"
else
  echo "Failed to start the container. Try restarting your system"
fi
