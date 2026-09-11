import { FastifyInstance } from "fastify";
import {
  authRoutes,
  userRoutes,
  locationRoutes,
  groupsRoutes,
} from "./features";

export function registerRoutes(app: FastifyInstance){
      app.register(authRoutes, { prefix: "/api/auth" });
      app.register(userRoutes, { prefix: "/api/user" });
      app.register(locationRoutes, { prefix: "/api/location" });
      app.register(groupsRoutes, { prefix: "/api/:userId/groups" });
}
