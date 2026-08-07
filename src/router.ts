
import { userRoutes } from "./routes/user";
import { locationRoutes } from "./routes/location";
import { FastifyInstance } from "fastify";
import { authRoutes } from "./routes/auth";



export function registerRoutes(app: FastifyInstance){
      app.register(authRoutes, { prefix: "/api/auth" });
      app.register(userRoutes, { prefix: "/api/user" });
      app.register(locationRoutes, { prefix: "/api/location" });
}