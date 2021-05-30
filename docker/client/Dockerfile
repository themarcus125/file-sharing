FROM node:14

# Create app directory
WORKDIR /client

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ENV M_HOST=server
ENV M_PORT=5000

EXPOSE 9000
ENTRYPOINT ["tail", "-f", "/dev/null"]