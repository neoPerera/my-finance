# Step 1: Build React app
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY env.js /usr/share/nginx/html/env.js
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
CMD envsubst '$REACT_APP_API_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
