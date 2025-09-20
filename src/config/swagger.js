const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Damayanti API',
      version: '1.0.0',
      description: 'Express.js REST API for the Damayanti application with full CRUD operations for all database entities.',
      contact: {
        name: 'API Support',
        email: 'support@damayanti.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.damayanti.com' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Enter your JWT token without "Bearer " prefix.'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'full_name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (min 6 characters)'
            },
            full_name: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
              description: 'User full name'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp'
            },
            modified_at: {
              type: 'string',
              format: 'date-time',
              description: 'User last modification timestamp'
            }
          }
        },
        UserResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            full_name: {
              type: 'string'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            modified_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Container: {
          type: 'object',
          required: ['code', 'location', 'user_id'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the container'
            },
            code: {
              type: 'string',
              maxLength: 50,
              description: 'Container code'
            },
            location: {
              type: 'string',
              maxLength: 100,
              description: 'Container location'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the user who owns this container'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            modified_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        SensorData: {
          type: 'object',
          required: ['container_id', 'temperature', 'humidity', 'gas', 'ph', 'user_id'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            container_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the container this sensor data belongs to'
            },
            temperature: {
              type: 'number',
              format: 'decimal',
              description: 'Temperature reading'
            },
            humidity: {
              type: 'number',
              format: 'decimal',
              description: 'Humidity reading'
            },
            gas: {
              type: 'number',
              format: 'decimal',
              description: 'Gas reading'
            },
            ph: {
              type: 'number',
              format: 'decimal',
              description: 'pH reading'
            },
            user_id: {
              type: 'string',
              format: 'uuid'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            modified_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Report: {
          type: 'object',
          required: ['user_id', 'container_id'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            user_id: {
              type: 'string',
              format: 'uuid'
            },
            container_id: {
              type: 'string',
              format: 'uuid'
            },
            notes: {
              type: 'string',
              description: 'Report notes'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            modified_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Sheep: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            name: {
              type: 'string',
              maxLength: 255,
              description: 'Sheep name'
            },
            age: {
              type: 'integer',
              minimum: 0,
              description: 'Sheep age in years'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            modified_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        SheepReport: {
          type: 'object',
          required: ['sheep_id', 'feeding_time', 'status'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            sheep_id: {
              type: 'string',
              format: 'uuid'
            },
            feeding_time: {
              type: 'string',
              format: 'date-time',
              description: 'When the sheep was fed'
            },
            status: {
              type: 'string',
              maxLength: 50,
              description: 'Feeding status'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            modified_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email'
            },
            password: {
              type: 'string'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            access_token: {
                  type: 'string',
                  description: 'JWT authentication token'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        MessageResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                users: {
                  type: 'array',
                  items: {
                    type: 'object'
                  }
                },
                pagination: {
                  type: 'object',
                  properties: {
                    total: {
                      type: 'integer',
                      description: 'Total number of records'
                    },
                    limit: {
                      type: 'integer',
                      description: 'Number of records per page'
                    },
                    offset: {
                      type: 'integer',
                      description: 'Number of records skipped'
                    },
                    hasMore: {
                      type: 'boolean',
                      description: 'Whether there are more records available'
                    }
                  }
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = specs;