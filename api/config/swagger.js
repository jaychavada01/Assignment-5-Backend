const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Assignment Backend Project",
      version: "1.0.0",
      description:
        "API documentation for user authentication, referrals, rewards, payments, and AWS integrations.",
      contact: {
        name: "Jay chavada",
        email: "jaykumarc@zignuts.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "User unique identifier",
            },
            firstName: {
              type: "string",
              description: "User's first name",
            },
            lastName: {
              type: "string",
              description: "User's last name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              format: "password",
              description: "User's password",
            },
            coins: {
              type: "integer",
              description: "User's reward coins",
              default: 100,
            },
            referralCode: {
              type: "string",
              description: "User's unique referral code",
            },
            profilePic: {
              type: "string",
              format: "uri",
              description: "URL to user's profile picture",
            },
            bio: {
              type: "string",
              description: "User's biography",
            },
            isProfileComplete: {
              type: "boolean",
              description: "Whether the user's profile is complete",
              default: false,
            },
            stripeCustomerId: {
              type: "string",
              description: "Stripe customer ID for payment processing",
            },
          },
        },
        CardDetails: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Card unique identifier",
            },
            userId: {
              type: "string",
              format: "uuid",
              description: "User ID associated with this card",
            },
            stripeCardId: {
              type: "string",
              description: "Stripe card identifier",
            },
            last4Digit: {
              type: "string",
              description: "Last 4 digits of the card number",
            },
            expMonth: {
              type: "integer",
              description: "Card expiration month",
            },
            expYear: {
              type: "integer",
              description: "Card expiration year",
            },
            brand: {
              type: "string",
              description: "Card brand (e.g., Visa, Mastercard)",
            },
            transactionId: {
              type: "string",
              description: "Transaction ID for payment transactions",
            },
            amount: {
              type: "integer",
              description: "Transaction amount in cents",
            },
            status: {
              type: "string",
              description: "Transaction status",
              enum: ["succeeded", "pending", "failed"],
            },
            client_secret: {
              type: "string",
              description: "Client secret for client-side confirmation",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
            status: {
              type: "integer",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
            },
            password: {
              type: "string",
              format: "password",
            },
          },
        },
        SignupRequest: {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: {
              type: "string",
            },
            lastName: {
              type: "string",
            },
            email: {
              type: "string",
              format: "email",
            },
            password: {
              type: "string",
              format: "password",
            },
            referredBy: {
              type: "string",
              description: "Referral code of the user who referred this user",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
            token: {
              type: "string",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        ProfileUpdateRequest: {
          type: "object",
          properties: {
            firstName: {
              type: "string",
            },
            lastName: {
              type: "string",
            },
            bio: {
              type: "string",
            },
          },
        },
        PasswordChangeRequest: {
          type: "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword: {
              type: "string",
              format: "password",
            },
            newPassword: {
              type: "string",
              format: "password",
            },
          },
        },
        ForgotPasswordRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
            },
          },
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["token", "newPassword"],
          properties: {
            token: {
              type: "string",
            },
            newPassword: {
              type: "string",
              format: "password",
            },
          },
        },
        // Payment-related schemas
        CreateCustomerRequest: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: {
              type: "string",
              description: "Customer's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "Customer's email address",
            },
          },
        },
        CreateCustomerResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            message: {
              type: "string",
            },
            customerId: {
              type: "string",
              description: "Stripe customer ID",
            },
          },
        },
        AddCardRequest: {
          type: "object",
          required: ["token"],
          properties: {
            token: {
              type: "string",
              description: "Stripe card token",
            },
          },
        },
        AddCardResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            message: {
              type: "string",
            },
            card: {
              $ref: "#/components/schemas/CardDetails",
            },
          },
        },
        MakePaymentRequest: {
          type: "object",
          required: ["amount", "cardId"],
          properties: {
            amount: {
              type: "integer",
              description: "Amount to charge in cents",
            },
            cardId: {
              type: "string",
              description: "ID of the saved card to use for payment",
            },
            description: {
              type: "string",
              description: "Description of the payment",
            },
          },
        },
        MakePaymentResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            message: {
              type: "string",
            },
            paymentDetails: {
              type: "object",
              properties: {
                transactionId: {
                  type: "string",
                },
                amount: {
                  type: "integer",
                },
                status: {
                  type: "string",
                },
                client_secret: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger Docs available at: http://localhost:3000/api-docs");
};

module.exports = swaggerDocs;