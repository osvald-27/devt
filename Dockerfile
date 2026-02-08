# Use the official Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose the port your server runs on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]