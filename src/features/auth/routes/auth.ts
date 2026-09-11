import { FastifyInstance } from "fastify";
import { RegisterUserSchema, LoginUserSchema } from "../types";
import { AuthController } from "../controllers";

const controller = new AuthController();

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", {
    schema: {
      body: RegisterUserSchema,
    },
    handler: controller.registerUser,
  });

  fastify.post("/login", {
    schema: {
      body: LoginUserSchema,
    },
    handler: controller.loginUser,
  });
}
