#!/bin/bash

# Stop and remove all containers running the specified image, suppress all output
docker rm $(docker stop $(docker ps -a -q --filter ancestor=rajneesh768/word2pdf:latest) 2>/dev/null) >/dev/null 2>&1

# Check if the command was successful
if [ $? -eq 0 ]; then
  echo "Application Stopped"
  echo "You may exit the console"
else
  echo "There are no Applications running"
fi
