# Use this base image
FROM node:alpine

ENV CI=TRUE

# Change the working directory to /app
WORKDIR /app
# Copy the app dependency and build file
COPY package*.json ./
# Install the dpendecies by running the command
RUN npm install
# copy the application files
COPY ./ ./
# instruction to start the application in the container
CMD ["npm", "start"]