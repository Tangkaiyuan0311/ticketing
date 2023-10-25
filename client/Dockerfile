FROM node:alpine

WORKDIR /app

COPY package.json ./
# only re install dependency if package.json is updated
# ignore dependencies related to testing 
RUN npm install --omit=dev

COPY ./ ./
CMD [ "npm", "run", "dev" ]