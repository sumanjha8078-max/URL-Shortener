# Use a lightweight Alpine image for production footprint
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (use npm ci for reliable builds in production)
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Define the startup command
CMD ["npm", "start"]
