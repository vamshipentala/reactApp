# Use an official Node.js image as the base image
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY client/ ./

# Build the frontend code
RUN npm run build

# Use a smaller Nginx image for serving the frontend build
FROM nginx:alpine

# Copy the built frontend files to Nginx's default web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy your custom NGINX configuration
#COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY client/default.conf /etc/nginx/conf.d

# Expose port 80
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
