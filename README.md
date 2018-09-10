# Bookshelf API

## JSON API example project
 
##### Stack of technologies:
* [Node.JS](https://nodejs.org)
* [Express.JS](https://expressjs.com)
* Sequelize
* PostgreSQL
* JWT 
* [Mocha](https://mochajs.org)
* [Swagger](https://swagger.io/docs/specification/about/)

## Installation
* Install Node.JS
* Install PostgreSQL

## Starting App
```
npm install
npm run create
npm run migrate
npm run seed
npm start
```

## Running Tests
```
npm test
```

## Usage

Client MUST specify the media type `application/vnd.api+json` in headers (`Content-Type` and `Accept`)

Other JSON API documentation you can find [here](http://jsonapi.org/format/#content-negotiation)

All API documentation you can find on page `/docs`:
```
http://localhost:3000/docs
```
