import { FastifyReply, FastifyRequest } from "fastify";
import { AuthBody, LoginBody } from "../schemas/auth";
import { AuthService } from "../services/auth";

const service = new AuthService();

export class AuthController {
  async registerUser(
    request: FastifyRequest<{ Body: AuthBody }>,
    reply: FastifyReply,
  ) {
    try {
      const result = await service.registerUser(request.body);
      return reply.status(201).send(result);
    } catch (error: any) {
      return reply.status(400).send({
        message: "Registration error",
        error: error.message,
      });
    }
  }

  async loginUser(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply,
  ) {
    try {
      const result = await service.loginUser(request.body);
      return reply.status(200).send(result);
    } catch (error: any) {
      return reply.status(401).send({
        message: "Invalid email or password",
        error: error.message,
      });
    }
  }
}
