#!/bin/bash
docker rm $(docker stop $(docker ps -a -q  --filter ancestor=rajneesh768/word2pdf:latest))