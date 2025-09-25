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
          ? 'https://damayanti-api.vercel.app' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      },
      {
        url: 'https://damayanti-api.vercel.app',
        description: 'Production server on Vercel'
      },
      {
        url: 'http://localhost:3000',
        description: 'Local development server'
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
          required: ['email', 'password', 'full_name', 'role'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the user'
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 100,
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              maxLength: 255,
              description: 'User password (min 6 characters)'
            },
            full_name: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
              description: 'User full name'
            },
            role: {
              type: 'integer',
              description: 'User role (numeric value)'
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
            },
            created_by: {
              type: 'string',
              format: 'uuid',
              description: 'ID of user who created this user'
            },
            modified_by: {
              type: 'string',
              format: 'uuid',
              description: 'ID of user who last modified this user'
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
            role: {
              type: 'integer'
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
        Student: {
          type: 'object',
          required: ['full_name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the student'
            },
            full_name: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
              description: 'Student full name'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Student creation timestamp'
            },
            modified_at: {
              type: 'string',
              format: 'date-time',
              description: 'Student last modification timestamp'
            }
          }
        },
        Container: {
          type: 'object',
          required: ['code'],
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
          required: ['container_id'],
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
            status: {
              type: 'string',
              maxLength: 50,
              description: 'Status of the sensor data'
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
          required: ['student_id', 'container_id', 'sensor_data_id'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the report'
            },
            student_id: {
              type: 'string',
              format: 'uuid',
              description: 'Foreign key reference to students table'
            },
            container_id: {
              type: 'string',
              format: 'uuid',
              description: 'Foreign key reference to containers table'
            },
            sensor_data_id: {
              type: 'string',
              format: 'uuid',
              description: 'Foreign key reference to sensor_data table'
            },
            notes: {
              type: 'string',
              description: 'Report notes'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Report creation timestamp'
            },
            modified_at: {
              type: 'string',
              format: 'date-time',
              description: 'Report last modification timestamp'
            },
            created_by: {
              type: 'string',
              format: 'uuid',
              description: 'ID of user who created the report'
            },
            modified_by: {
              type: 'string',
              format: 'uuid',
              description: 'ID of user who last modified the report'
            }
          }
        },
        Sheep: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the sheep'
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
              format: 'date-time',
              description: 'Sheep creation timestamp'
            },
            modified_at: {
              type: 'string',
              format: 'date-time',
              description: 'Sheep last modification timestamp'
            },
            created_by: {
              type: 'string',
              format: 'uuid',
              description: 'ID of user who created the sheep'
            },
            modified_by: {
              type: 'string',
              format: 'uuid',
              description: 'ID of user who last modified the sheep'
            }
          }
        },
        SheepReport: {
          type: 'object',
          required: ['sheep_id', 'feeding_time', 'status'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the sheep report'
            },
            sheep_id: {
              type: 'string',
              format: 'uuid',
              description: 'Foreign key reference to sheeps table'
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
              format: 'date-time',
              description: 'Sheep report creation timestamp'
            },
            modified_at: {
              type: 'string',
              format: 'date-time',
              description: 'Sheep report last modification timestamp'
            },
            created_by: {
              type: 'string',
              format: 'uuid',
              description: 'ID of user who created the sheep report'
            },
            modified_by: {
              type: 'string',
              format: 'uuid',
              description: 'ID of user who last modified the sheep report'
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
        Pagination: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              description: 'Total number of records',
              example: 100
            },
            limit: {
              type: 'integer',
              description: 'Number of records per page',
              example: 50
            },
            offset: {
              type: 'integer',
              description: 'Number of records skipped',
              example: 0
            },
            hasMore: {
                type: 'boolean',
                description: 'Whether there are more records available',
                example: true
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