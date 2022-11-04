FROM node:16

# Create app dir
WORKDIR /Users/mac/Documents/BlockChain/eth-todo-list

#Install app dependencies
COPY package*.json ./

RUN npm install

#Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "run", "dev"]

