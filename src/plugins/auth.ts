import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import * as jwt from "jsonwebtoken";
import { role_type } from "../../generated/prisma/client";

export type JwtUser = {
  id: number;
  email: string;
  role: role_type;
};

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }

  interface FastifyRequest {
    user: JwtUser;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const header = request.headers.authorization;
      if (!header?.startsWith("Bearer ")) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const token = header.slice("Bearer ".length);
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return reply.status(500).send({ message: "JWT secret is not configured" });
      }

      try {
        request.user = jwt.verify(token, secret) as JwtUser;
      } catch {
        return reply.status(401).send({ message: "Invalid or expired token" });
      }
    },
  );
}

export function authorize(...roles: role_type[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    if (!roles.includes(request.user.role)) {
      return reply.status(403).send({ message: "Forbidden" });
    }
  };
}

export default fp(authPlugin);
