FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# setup Google Service Account Credentials
#COPY service-account.json /usr/src/app/
#ENV GOOGLE_APPLICATION_CREDENTIALS service-account..json

EXPOSE 8080
CMD [ "npm", "start" ]