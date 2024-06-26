FROM node:18

WORKDIR /usr/src/app

# Copy all the files from your file system to the container file system
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy other files as well
COPY . .

# Expose the port
EXPOSE 5601

# Command to execute when the image is instantiated
CMD ["npm","start"]