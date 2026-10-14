import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import cors from "@fastify/cors";
import type { AppConfig } from "./config";
import { authPlugin, createDb, errorHandler, EventBus, logger } from "./shared";
import { createIdentityModule } from "./modules/identity";
import { createLocationsModule } from "./modules/locations";
import { createMembersModule } from "./modules/members";
import { createGroupsModule } from "./modules/groups";

// Composition root: the only place that knows about every module and wires
// their dependencies together.
export async function buildApp(config: AppConfig) {
  const app = Fastify({ logger: true });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Karate Team API",
        description: "API для управління спортсменами, тренерами та командами",
        version: "1.0.0",
      },
      servers: [{ url: `http://localhost:${config.port}`, description: "Local server" }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await app.register(cors, {
    origin: config.corsOrigin,
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

  await app.register(authPlugin, { jwtSecret: config.jwtSecret });
  app.setErrorHandler(errorHandler);

  const db = createDb(config.databaseUrl);
  const events = new EventBus(logger);
  app.addHook("onClose", () => db.$disconnect());

  const locations = createLocationsModule({ db });
  const identity = createIdentityModule({
    db,
    events,
    jwtSecret: config.jwtSecret,
    jwtExpiresIn: config.jwtExpiresIn,
  });
  const members = createMembersModule({
    db,
    events,
    identity: identity.api,
    locations: locations.api,
  });
  const groups = createGroupsModule({ db, identity: identity.api });

  for (const module of [identity, members, groups, locations]) {
    await app.register(module.routes, { prefix: module.prefix });
  }

  return app;
}
