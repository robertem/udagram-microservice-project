# Use NodeJS base image
FROM node:15-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Copy typescript configurations
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Build project
RUN npm run build

# Use NodeJS base image
FROM node:15-alpine

# Create app directory
WORKDIR /app

# Install app dependencies for production
COPY package*.json ./

RUN npm install --only=production

# Copy app build
COPY --from=builder /usr/src/app/www ./www

# Bind the port that the image will run on
EXPOSE 8080

# Define the Docker image's behavior at runtime
CMD ["node", "www/server.js"]