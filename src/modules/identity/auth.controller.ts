import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service";
import { LoginBody, RegisterBody } from "./auth.schemas";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = async (
    request: FastifyRequest<{ Body: RegisterBody }>,
    reply: FastifyReply,
  ) => {
    return reply.status(201).send(await this.service.register(request.body));
  };

  login = async (
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply,
  ) => {
    return reply.send(await this.service.login(request.body));
  };
}
