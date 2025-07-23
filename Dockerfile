FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy all files and install dependencies
COPY . .
RUN npm install

# Build your frontend
RUN npm run build

# Install serve to serve the built frontend
RUN npm install -g serve

# Expose the port serve will use
EXPOSE 4173

# Run the app using serve
CMD ["serve", "-s", "dist", "-l", "4173"]
