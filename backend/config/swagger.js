import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HealthGenie API',
      version: '1.0.0',
      description: 'HealthGenie Backend REST API — AI-powered health assistant with MongoDB, Grok AI, and Google Maps integration.',
      contact: {
        name: 'HealthGenie Team'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server'
      }
    ],
    tags: [
      { name: 'Health', description: 'Server health check' },
      { name: 'AI', description: 'AI Chat & Hospital Triage powered by Grok' },
      { name: 'Diet', description: 'Diet & Meal Image endpoints' },
      { name: 'Hospitals', description: 'Nearby Hospitals & Autocomplete' },
      { name: 'Doctors', description: 'Nearby Doctors search' },
      { name: 'Config', description: 'API Key management' },
      { name: 'Email', description: 'Gmail SMTP Email Service' }
    ],
    paths: {
      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'Health Check',
          description: 'Returns server status, timestamp, and configured AI providers.',
          responses: {
            200: {
              description: 'Server is running',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      timestamp: { type: 'string', format: 'date-time' },
                      providers: {
                        type: 'object',
                        properties: {
                          grok: { type: 'boolean' },
                          ollama: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/ai/chat': {
        post: {
          tags: ['AI'],
          summary: 'AI Chat (Streaming)',
          description: 'Send a prompt to the HealthGenie AI (powered by Grok). Returns chunked streaming JSON responses.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['prompt'],
                  properties: {
                    prompt: { type: 'string', example: 'I have a headache and mild fever for 2 days' },
                    context: { type: 'string', enum: ['general', 'symptoms', 'diet', 'exercise', 'women', 'pregnancy', 'doctor', 'firstAid', 'healthScore'], example: 'symptoms' },
                    options: {
                      type: 'object',
                      properties: {
                        temperature: { type: 'number', example: 0.7 }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Streamed AI response (chunked JSON lines)',
              content: {
                'text/plain': {
                  schema: { type: 'string', example: '{"response":"...","done":false}\n{"response":"","done":true}\n' }
                }
              }
            }
          }
        }
      },
      '/api/ai/recommend-hospitals': {
        post: {
          tags: ['AI'],
          summary: 'AI Hospital Triage',
          description: 'Analyze symptoms and recommend hospital type and urgency level using Grok AI.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['symptoms'],
                  properties: {
                    symptoms: { type: 'string', example: 'severe chest pain and shortness of breath' },
                    userLocation: {
                      type: 'object',
                      properties: {
                        lat: { type: 'number', example: 17.385 },
                        lng: { type: 'number', example: 78.4867 }
                      }
                    },
                    radiusMeters: { type: 'integer', example: 5000 }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'AI triage recommendation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'OK' },
                      symptoms: { type: 'string' },
                      recommendation: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/diet/meal-image': {
        get: {
          tags: ['Diet'],
          summary: 'Get Meal Image (GET)',
          description: 'Fetch a validated meal image record by meal title.',
          parameters: [
            { name: 'mealTitle', in: 'query', required: true, schema: { type: 'string' }, example: 'Grilled Chicken Salad' },
            { name: 'mealType', in: 'query', schema: { type: 'string' }, example: 'lunch' },
            { name: 'description', in: 'query', schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Meal image record' },
            400: { description: 'Missing mealTitle' }
          }
        },
        post: {
          tags: ['Diet'],
          summary: 'Generate Meal Image (POST)',
          description: 'Generate or fetch a validated meal image record by sending meal details.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['mealTitle'],
                  properties: {
                    mealTitle: { type: 'string', example: 'Oatmeal with Berries' },
                    mealType: { type: 'string', example: 'breakfast' },
                    description: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Meal image record' },
            400: { description: 'Missing mealTitle' }
          }
        }
      },
      '/api/hospitals/nearby': {
        get: {
          tags: ['Hospitals'],
          summary: 'Nearby Hospitals',
          description: 'Get hospitals near a location. Uses Google Places → Overpass → MongoDB fallback chain.',
          parameters: [
            { name: 'lat', in: 'query', schema: { type: 'number' }, example: 17.385 },
            { name: 'lng', in: 'query', schema: { type: 'number' }, example: 78.4867 },
            { name: 'radius', in: 'query', schema: { type: 'integer' }, example: 5000, description: 'Radius in meters' },
            { name: 'query', in: 'query', schema: { type: 'string' }, example: 'trauma' }
          ],
          responses: {
            200: {
              description: 'List of nearby hospitals',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'OK' },
                      provider: { type: 'string', example: 'database' },
                      total: { type: 'integer' },
                      results: { type: 'array', items: { type: 'object' } }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/hospitals/autocomplete': {
        get: {
          tags: ['Hospitals'],
          summary: 'Hospital Autocomplete',
          description: 'Get hospital name suggestions for search input.',
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string' }, example: 'city' }
          ],
          responses: {
            200: { description: 'List of suggestions' }
          }
        }
      },
      '/api/doctors/nearby': {
        get: {
          tags: ['Doctors'],
          summary: 'Nearby Doctors',
          description: 'Get doctors near a location. Uses Google Places → Overpass → MongoDB fallback chain.',
          parameters: [
            { name: 'lat', in: 'query', schema: { type: 'number' }, example: 17.385 },
            { name: 'lng', in: 'query', schema: { type: 'number' }, example: 78.4867 },
            { name: 'radius', in: 'query', schema: { type: 'integer' }, example: 5000 },
            { name: 'specialty', in: 'query', schema: { type: 'string' }, example: 'Cardiologist' },
            { name: 'query', in: 'query', schema: { type: 'string' } }
          ],
          responses: {
            200: {
              description: 'List of nearby doctors',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'OK' },
                      provider: { type: 'string' },
                      total: { type: 'integer' },
                      results: { type: 'array', items: { type: 'object' } }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/config/keys': {
        get: {
          tags: ['Config'],
          summary: 'Get API Keys Status',
          description: 'Check which API keys are configured (masked).',
          responses: {
            200: {
              description: 'Key status',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      hasGooglePlaces: { type: 'boolean' },
                      hasGrok: { type: 'boolean' }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Config'],
          summary: 'Update API Keys',
          description: 'Dynamically update API keys at runtime.',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    googlePlacesKey: { type: 'string' },
                    grokKey: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Keys updated successfully' }
          }
        }
      },
      '/api/email/verify': {
        get: {
          tags: ['Email'],
          summary: 'Verify SMTP Connection',
          description: 'Test that the Gmail SMTP connection and credentials are valid.',
          responses: {
            200: { description: 'SMTP connection verified' },
            500: { description: 'SMTP verification failed with troubleshooting steps' }
          }
        }
      },
      '/api/email/send': {
        post: {
          tags: ['Email'],
          summary: 'Send Custom Email',
          description: 'Send a custom email with arbitrary subject and HTML body.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['to', 'subject', 'html'],
                  properties: {
                    to: { type: 'string', example: 'user@example.com' },
                    subject: { type: 'string', example: 'Test Email from HealthGenie' },
                    html: { type: 'string', example: '<h1>Hello!</h1><p>This is a test.</p>' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Email sent successfully' },
            400: { description: 'Validation error' },
            500: { description: 'Email sending failed' }
          }
        }
      },
      '/api/email/send-otp': {
        post: {
          tags: ['Email'],
          summary: 'Send OTP Verification Email',
          description: 'Generate and send a 6-digit OTP code to the specified email address.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['to'],
                  properties: {
                    to: { type: 'string', example: 'user@example.com' },
                    recipientName: { type: 'string', example: 'Munaf' },
                    expiryMinutes: { type: 'integer', example: 10 }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'OTP sent. Returns the OTP for backend verification.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'OK' },
                      otp: { type: 'string', example: '482917' },
                      expiryMinutes: { type: 'integer', example: 10 }
                    }
                  }
                }
              }
            },
            400: { description: 'Validation error' }
          }
        }
      },
      '/api/email/send-reset': {
        post: {
          tags: ['Email'],
          summary: 'Send Password Reset Email',
          description: 'Send a password reset email containing a secure reset link.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['to', 'resetLink'],
                  properties: {
                    to: { type: 'string', example: 'user@example.com' },
                    recipientName: { type: 'string', example: 'Munaf' },
                    resetLink: { type: 'string', example: 'https://healthgenie.app/reset?token=abc123' },
                    expiryMinutes: { type: 'integer', example: 30 }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Reset email sent successfully' },
            400: { description: 'Validation error' }
          }
        }
      },
      '/api/email/send-welcome': {
        post: {
          tags: ['Email'],
          summary: 'Send Welcome Email',
          description: 'Send a welcome email to a newly registered user.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['to'],
                  properties: {
                    to: { type: 'string', example: 'user@example.com' },
                    recipientName: { type: 'string', example: 'Munaf' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Welcome email sent successfully' },
            400: { description: 'Validation error' }
          }
        }
      }
    }
  },
  apis: [] // We defined paths inline above
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
