# Use NodeJS base image
FROM node:15-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install ionic cli
RUN npm install -g ionic

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Build project
RUN ionic build

# Use NodeJS base image
FROM nginx:alpine

# Copy app build
COPY --from=builder /usr/src/app/www /usr/share/nginx/html