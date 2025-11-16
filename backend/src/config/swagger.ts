import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Project & Tasks API",
    version: "1.0.0",
    description:
      "API para la plataforma de gestión de proyectos y tareas colaborativa (Prueba técnica Fullstack).",
  },
  servers: [
    {
      url: process.env.API_URL || `http://localhost:${process.env.PORT || 4000}`,
      description: "Servidor local",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      // ====== AUTH ======
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Juan Pérez" },
          email: { type: "string", example: "juan@example.com" },
          password: { type: "string", example: "123456" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "juan@example.com" },
          password: { type: "string", example: "123456" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: {
            type: "string",
            example:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },

      // ====== USER ======
      User: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          name: { type: "string", example: "Juan Pérez" },
          email: { type: "string", example: "juan@example.com" },
          role: { type: "string", example: "user" },
        },
      },

      // ====== PROJECT ======
      Project: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          name: { type: "string", example: "Proyecto A" },
          description: { type: "string", example: "Descripción del proyecto" },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      // ====== TASK ======
      Task: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          title: { type: "string", example: "Implementar login" },
          description: {
            type: "string",
            example: "Implementar pantalla de login",
          },
          status: {
            type: "string",
            enum: ["pendiente", "en progreso", "completada"],
            example: "pendiente",
          },
          priority: {
            type: "string",
            enum: ["baja", "media", "alta"],
            example: "media",
          },
          projectId: { type: "number", example: 1 },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      // ====== STATS ======
      StatsResponse: {
        type: "object",
        properties: {
          totalProjects: { type: "number", example: 3 },
          totalTasks: { type: "number", example: 12 },
          completed: { type: "number", example: 5 },
          inProgress: { type: "number", example: 4 },

          estados: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", example: "pendiente" },
                value: { type: "number", example: 4 },
              },
            },
          },

          prioridades: {
            type: "array",
            items: {
              type: "object",
              properties: {
                priority: { type: "string", example: "alta" },
                count: { type: "number", example: 2 },
              },
            },
          },

          historial: {
            type: "array",
            items: {
              type: "object",
              properties: {
                day: { type: "string", example: "2025-11-14" },
                completed: { type: "number", example: 3 },
              },
            },
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [
    "./src/modules/auth/*.routes.ts",
    "./src/modules/projects/*.routes.ts",
    "./src/modules/tasks/*.routes.ts",
    "./src/modules/stats/*.routes.ts",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerDocs(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  const docsUrl =
    (process.env.API_URL ||
      `http://localhost:${process.env.PORT || 4000}`) + "/docs";

  console.log(`Swagger disponible en: ${docsUrl}`);
}
