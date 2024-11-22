# Use a base image with your preferred runtime environment
FROM ubuntu:22.04

# Set environment variables to prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Update the system and install necessary tools
RUN apt-get update && apt-get install -y \
    software-properties-common \
    curl \
    wget \
    && apt-get clean

# Install LibreOffice
RUN apt-get update && apt-get install -y \
    libreoffice \
    && apt-get clean

# Install qpdf
RUN apt-get update && apt-get install -y \
    qpdf \
    && apt-get clean

# Copy your application code into the container
WORKDIR /app
COPY . /app

# Install any additional app dependencies (if applicable)
# Example for Node.js apps:
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs && npm install


EXPOSE 3000

CMD ["node", "app.js"]
