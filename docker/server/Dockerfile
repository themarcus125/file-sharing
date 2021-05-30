FROM mhart/alpine-node:14

# Install pm2 for process managing
RUN npm install -g pm2

# Create app directory
WORKDIR /fileserver

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose fileserver
# Define runtime environments 
ENV NODE_ENV=test
ENV F_HOST=localhost
ENV F_PORT=1845

EXPOSE 5000
EXPOSE 1845
CMD ["pm2-runtime", "server-process.yml"]