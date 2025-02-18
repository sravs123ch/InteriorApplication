# FROM node:22-alpine AS builder
FROM node:20-alpine AS builder

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the rest of the application code
COPY . .

# Build the application
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Build the React app
RUN npm run build

# Step 2: Use a lightweight web server for serving static files
FROM nginx:alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React files to the Nginx HTML directory
COPY --from=builder /app/build /usr/share/nginx/html


# Expose the port Nginx will run on
EXPOSE 4020

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
