# Step 1: Build React app
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve React app with NGINX
FROM nginx:alpine

# Copy build output to NGINX public folder
COPY --from=build /app/dist  /usr/share/nginx/html

# Copy a default NGINX config if you have custom settings
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Optional: Copy placeholder env.js (or inject it via volume later)
#COPY env.js /usr/share/nginx/html/env.js

EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
