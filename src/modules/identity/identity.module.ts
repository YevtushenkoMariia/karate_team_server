import { FastifyInstance } from "fastify";
import type { AppModule, Db, EventBus } from "../../shared";
import { UsersRepository } from "./users.repository";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { LoginBody, RegisterBody } from "./auth.schemas";
import { createIdentityApi, IdentityApi } from "./identity.api";

type Deps = {
  db: Db;
  events: EventBus;
  jwtSecret: string;
  jwtExpiresIn: string;
};

export function createIdentityModule(deps: Deps): AppModule & { api: IdentityApi } {
  const users = new UsersRepository(deps.db);
  const authService = new AuthService(users, deps.events, {
    secret: deps.jwtSecret,
    expiresIn: deps.jwtExpiresIn,
  });
  const controller = new AuthController(authService);

  return {
    name: "identity",
    prefix: "/api/auth",
    api: createIdentityApi(users),
    routes: async (fastify: FastifyInstance) => {
      fastify.post("/register", {
        schema: { body: RegisterBody },
        handler: controller.register,
      });

      fastify.post("/login", {
        schema: { body: LoginBody },
        handler: controller.login,
      });
    },
  };
}
