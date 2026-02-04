const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Site SIFSoft',
      version: '1.0.0',
      description: 'Documentação utilizada para a atualização do site',
    },
    servers: [
      {
        url: 'http://localhost:3000/api-docs', // Mude para a porta que você usa
      },
    ],
  },
  // Onde estão as rotas que o Swagger deve ler
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;