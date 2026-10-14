import { defineEvent } from "../../shared";
import type { role_type } from "../../../generated/prisma/client";

export const UserRegistered = defineEvent<{
  userId: string;
  role: role_type;
}>("identity.user-registered");
