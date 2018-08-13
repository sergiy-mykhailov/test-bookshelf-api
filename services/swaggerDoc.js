
const swaggerJSDoc = require('swagger-jsdoc');
const config = require('../config/index');

// TODO: fix auth options
// options for the swagger docs
let options = {
  definition: {
    info: {
      title: 'JSON API',
      version: '0.0.1',
      description: 'JSON API example project',
      externalDocs: {
        description: 'More information about JSON API format',
        url: 'http://jsonapi.org/format/#content-negotiation'
      },
    },
    host:`${config.host}:${config.port}`,
    // basePath: '/',
    // securityDefinitions: {
    //   Bearer: {
    //     type: 'apiKey',
    //     name: 'Authorization',
    //     in: 'header'
    //   }
    // }
    securityDefinitions: {
      Bearer: {
          type: 'JWT',
          name: 'Authorization',
          in: 'header'
        }
    },
    // components: {
    //   securitySchemes: {
    //     BearerAuth: {
    //       type: 'http',
    //       scheme: 'bearer',
    //       bearerFormat: 'JWT',
    //     },
    //   },
    // },
  },
  apis: ['./api/*.js'],
};

// initialize swagger-jsdoc
let swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
