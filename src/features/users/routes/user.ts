import { FastifyInstance } from "fastify";
import { UserController } from "../controllers";
import { UpdateUserProfileSchema, UserProfileSchema } from "../types";
import { role_type } from "../../../../generated/prisma/client";
import { authorize } from "../../../shared/plugins";

const controller = new UserController();

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/profile", {
    schema: {
      querystring: UserProfileSchema,
    },
    preHandler: [
      fastify.authenticate,
      authorize(role_type.ADMIN, role_type.COACH, role_type.SPORTSMAN),
    ],
    handler: controller.getUserProfile,
  });

  fastify.put("/profile-update", {
    schema: {
      body: UpdateUserProfileSchema,
      security: [{ bearerAuth: [] }],
    },
    preHandler: [
      fastify.authenticate,
      authorize(role_type.ADMIN, role_type.COACH, role_type.SPORTSMAN),
    ],
    handler: controller.updateUserProfile,
  });
}
