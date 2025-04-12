# Step 1: Build React app
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve React app with NGINX
FROM nginx:alpine

# Copy the build into the NGINX image
COPY --from=build /app/build /usr/share/nginx/html

# Copy the NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Command to run NGINX
CMD ["nginx", "-g", "daemon off;"]
