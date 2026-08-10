# URL Shortener API - Deployment Guide

This document outlines the steps to deploy the URL Shortener API stack (Node.js, MongoDB, Redis) to an Ubuntu/Linux VM (like DigitalOcean, AWS EC2, or a local server) using Docker and Docker Compose.

## Prerequisites

1. **A Linux Server** (Ubuntu 20.04/22.04 recommended).
2. **Docker** installed on the server.
3. **Docker Compose** installed on the server.

### Installing Docker & Docker Compose (Ubuntu)

If Docker is not already installed, connect to your server via SSH and run the following commands:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io -y
sudo systemctl enable --now docker

# Install Docker Compose plugin
sudo apt install docker-compose-plugin -y

# Add your user to the docker group (optional, avoids needing sudo for docker commands)
sudo usermod -aG docker $USER
newgrp docker
```

## Deployment Steps

### 1. Clone the Repository

SSH into your VM and clone the project to your preferred directory (e.g., `/opt/url-shortener` or your home folder):

```bash
git clone <your-repository-url>
cd url-shortener
```

### 2. Configure the Environment

Create a `.env` file for the production environment. While Docker Compose injects the internal network URLs automatically, you might still want a `.env` file to customize application-specific variables.

```bash
# Create the .env file
nano .env
```

Add the following configuration (adjust as needed):

```env
PORT=3000
# The container names resolve automatically on the Docker network
MONGO_URI=mongodb://mongo:27017/url-shortener
REDIS_URI=redis://redis:6379
```

### 3. Build and Start the Stack

Use Docker Compose to build the Node.js API image and start all the services (API, MongoDB, and Redis) in the background.

```bash
docker compose up -d --build
```

- `-d`: Runs the containers in detached mode (in the background).
- `--build`: Forces a fresh build of the `api` service using the local `Dockerfile`.

### 4. Verify the Deployment

Check if all containers are running successfully:

```bash
docker compose ps
```

You should see three containers (`url-shortener-api`, `url-shortener-mongo`, `url-shortener-redis`) with the state `Up`.

### 5. Viewing Logs

To troubleshoot or monitor the application, you can view the logs for the entire stack or a specific service:

```bash
# View logs for all services (follow live)
docker compose logs -f

# View logs for the API service only
docker compose logs -f api

# View logs for MongoDB only
docker compose logs -f mongo
```

## Managing the Application

- **Stop the application:** `docker compose stop`
- **Restart the application:** `docker compose restart`
- **Tear down the application (preserves volumes):** `docker compose down`
- **Tear down the application AND delete data (Caution!):** `docker compose down -v`

Your URL Shortener API is now running and accessible on port `3000` of your server's IP address (e.g., `http://<your-server-ip>:3000`). For a production setup, consider putting a reverse proxy (like Nginx or Traefik) in front of the API to handle SSL/TLS termination and route traffic from port 80/443.
