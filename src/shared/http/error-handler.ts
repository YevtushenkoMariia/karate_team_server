import { STATUS_CODES } from "node:http";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "../../../generated/prisma/client";
import { AppError } from "../errors";

function send(reply: FastifyReply, statusCode: number, message: string) {
  return reply.status(statusCode).send({
    statusCode,
    error: STATUS_CODES[statusCode],
    message,
  });
}

// Single place that turns thrown errors into HTTP responses,
// so controllers and services never build error replies themselves.
export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    return send(reply, error.statusCode, error.message);
  }

  if ("validation" in error && error.validation) {
    return send(reply, 400, error.message);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return send(reply, 409, "Resource already exists");
    }
    if (error.code === "P2025") {
      return send(reply, 404, "Resource not found");
    }
  }

  // Fastify's own client errors (bad JSON, wrong content type, ...)
  if ("statusCode" in error && error.statusCode && error.statusCode < 500) {
    return send(reply, error.statusCode, error.message);
  }

  request.log.error(error);
  return send(reply, 500, "Internal server error");
}
