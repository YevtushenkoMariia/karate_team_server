import { FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import * as jwt from "jsonwebtoken";
import { role_type } from "../../../generated/prisma/client";
import { ForbiddenError, UnauthorizedError } from "../errors";

export type JwtUser = {
  id: string;
  email: string;
  role: role_type;
};

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>;
  }

  interface FastifyRequest {
    user: JwtUser;
  }
}

type AuthPluginOptions = {
  jwtSecret: string;
};

async function authPlugin(
  fastify: FastifyInstance,
  options: AuthPluginOptions,
) {
  fastify.decorate("authenticate", async (request: FastifyRequest) => {
    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedError();
    }

    const token = header.slice("Bearer ".length);
    try {
      request.user = jwt.verify(token, options.jwtSecret) as JwtUser;
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }
  });
}

export function authorize(...roles: role_type[]) {
  return async (request: FastifyRequest) => {
    if (!request.user) {
      throw new UnauthorizedError();
    }

    if (!roles.includes(request.user.role)) {
      throw new ForbiddenError();
    }
  };
}

// Allows the request only when the user id in the route params is the
// caller's own id (admins may act on behalf of anyone).
export function requireSelf(paramName: string) {
  return async (request: FastifyRequest) => {
    const params = request.params as Record<string, string | undefined>;

    if (
      request.user.role !== role_type.ADMIN &&
      params[paramName] !== request.user.id
    ) {
      throw new ForbiddenError("You can only access your own resources");
    }
  };
}

export default fp<AuthPluginOptions>(authPlugin);
