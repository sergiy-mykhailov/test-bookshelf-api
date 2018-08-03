# Bookshelf API

## JSON API with the next stack of technologies:
* [Node.JS](https://nodejs.org)
* [Express.JS](https://expressjs.com)
* Sequelize
* ACL
* PostgreSQL
* JWT 
* [Mocha](https://mochajs.org)

## Instalation
* Install Node.JS
* Instal PostgreSQL
* create database: `npm run create`

## Starting App

##### Without Migrations
```
npm install
npm start
```

##### With Migrations
```
npm install
node_modules/.bin/sequelize db:migrate
npm start
```

## Running Tests
```
npm test
```

