# Nodular Backend App - NodeJS

![nodular logo](public/images/logo.png?raw=true | width=200)
A *"modular" / "nodular"* Node.js App using [Express 4](http://expressjs.com/) to serve APIs & web-based views.

## Overall App Structure

````
├───.docker
│   └───data
│       └───mysql
│           ├───nodular
│           ├───mysql
│           ├───performance_schema
│           └───sys
├───app
│   ├───commands
│   ├───contracts
│   ├───errors
│   ├───helpers
│   ├───http
│   │   ├───controllers
│   │   │   └───api
│   │   │       └───v1
│   │   ├───middlewares
│   │   │   └───policies
│   │   └───responses
│   ├───models
│   ├───providers
│   ├───repositories
│   ├───services
│   ├───tasks
│   │   ├───DatabaseNotification
│   │   └───Imports
│   │       └───Student
│   ├───transformers
│   ├───utilities
│   │   ├───AWS
│   │   ├───fcm
│   │   ├───Logger
│   │   ├───mail
│   │   ├───paginator
│   │   └───passport
│   └───validators
├───config
├───database
│   ├───migrations
│   ├───raw-query
│   └───seeders
├───public
│   ├───images
│   └───samples
├───routes
├───storage
│   ├───conversations
│   ├───imports
│   └───logs
├───uploads
│   ├───documents
│   └───images
└───views
    └───emails
        └───auth
````

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
git clone git@bitbucket.org:saumya04/Nodular.git # or clone your own fork
cd Nodular
npm install
npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/). (Port depends upon the values from your env file)

## Documentation

This app is following the nodejs (express) boilerplate from [hackathon-starter project](https://github.com/sahat/hackathon-starter)

## Docker Help

Commands to start and stop containers for this app:

- Command to start the containers (**"--build"** is for rebuilding with the dockerfile)
    ````
    docker-compose -f .docker/docker-compose.yml up -d --build
    ````
- Command to stop the containers (with rebuilding the dockerfile)
    ````
    docker-compose -f .docker/docker-compose.yml stop
    ````
- Command to kill a specific container
    ````
    docker kill {container_name_or_id}`
    ````
- Command to remove a specific container
    ````
    docker rm {container_name_or_id}
    ````

## All about Crons


- running a cron

```
0 * * * * /usr/local/bin/node app/commands/cron-job.js
tail -f /var/log/cron.log
