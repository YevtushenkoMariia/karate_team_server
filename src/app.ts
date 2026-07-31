import Fastify from "fastify";
import { athleteRoutes as sportsmenRoutes } from "./routes/sportsmens";
import { authRoutes } from "./routes/auth";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import authPlugin from "./plugins/auth";
import cors from "@fastify/cors";


export async function buildApp() {
  const app = Fastify({
    logger: true
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Karate Team API",
        description: "API для управління спортсменами, тренерами та командами",
        version: "1.0.0",
      },
      servers: [{ url: "http://localhost:4000", description: "Local server" }],
    },
  });

  await app.register(cors, {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
});

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });

  await app.register(authPlugin);

  app.register(sportsmenRoutes, { prefix: "/api/athletes" });
  app.register(authRoutes, { prefix: "/api/auth" });

  return app;
}
