FROM ubuntu:20.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    # Install Firefox dependencies
    && apt-get install -y \
    firefox \
    libdbus-glib-1-2 \
    libxt6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install
# Install Playwright Firefox
RUN npx playwright install firefox

COPY . .

# Use the local server for Docker
CMD [ "npm", "run", "dev" ]