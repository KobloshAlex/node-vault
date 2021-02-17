#base image to use
FROM node:carbon-alpine

#the app directory
WORKDIR /usr/src/app

#copy package.json and package-lock.json
COPY package*.json ./

#build the code for production, and install app dependencies
RUN npm install --only=production

#bundle source code inside the Docker image
COPY . .

#Bind port to 3000
EXPOSE 3000

#RUN the application
CMD ["npm", "start"]