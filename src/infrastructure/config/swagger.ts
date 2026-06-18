import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Envios JCA API',
      version: '1.0.0',
      description: 'Documentación de la API de gestión de envíos',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterUserDto: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'Julian Caristizabal',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'julian@example.com',
            },
            password: {
              type: 'string',
              minLength: 8,
              example: 'mipassword123',
            },
          },
        },
        LoginUserDto: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'julian@example.com',
            },
            password: {
              type: 'string',
              example: 'mipassword123',
            },
          },
        },
        UserPublic: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Julian Caristizabal' },
            email: { type: 'string', example: 'julian@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensaje de error' },
          },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Datos inválidos' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'El correo no tiene un formato válido' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/infrastructure/http/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
