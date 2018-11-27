# specifiy the node image to be used
FROM node:8.11.3

# installing cron
RUN apt-get update && apt-get -y install nano && apt-get -y install cron

# ADD package.json package.json
# COPY package.json /usr/src/app/package.json
# VOLUME [ "/usr/src/app" ]
WORKDIR /usr/src/app

# prevent bcrypt from segmentation fault
RUN npm rebuild bcrypt --build-from-source

# installing sequelize-cli for seeding and migration purposes
RUN npm install -g nodemon sequelize-cli

# ADD package.json /usr/src/app/package.json

# Install app dependencies
RUN npm install

# RUN node_modules/.bin/sequelize db:seed:all
# RUN cp docker-server-entrypoint.sh /usr/local/bin/ && \
#   chmod +x /usr/local/bin/docker-server-entrypoint.sh

EXPOSE 5000
# ENTRYPOINT [ "docker-server-entrypoint.sh" ]
CMD ["npm", "start"]
# CMD ["-D", "FOREGROUND"]