import Fastify from "fastify";
import { athleteRoutes as sportsmenRoutes } from "./routes/sportsmens";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";


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

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });

  app.register(sportsmenRoutes, { prefix: "/api/athletes" });

  return app;
}
