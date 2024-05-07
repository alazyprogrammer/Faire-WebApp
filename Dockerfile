# Use official Node.js image as a base
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the PORT environment variable
ENV PORT=8080

# Build the React app
RUN npm run build

# Expose port 8080
EXPOSE 8080

# Start the React app
CMD ["npm", "start"]
