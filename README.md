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
```
npm install
npm run migrate
npm start
```

## Running Tests
```
npm test
```

## Usage

Client MUST specify the media type `application/vnd.api+json` in headers (`Content-Type` and `Accept`) - [Documentation](http://jsonapi.org/format/#content-negotiation)

##### Sign-Up

* Method: `POST`
* Url: `/signup`
* Example:
```json
{
  "data": {
    "type": "users",
    "attributes": {
      "name": "Jack",
      "password": "secretpassword",
      "email": "jack@example.com",
      "address": "15 Gray str., New York, USA",
      "telephone": "+1(234)5678910",
      "website": "www.jack.website.com"
    }
  }
}
```
