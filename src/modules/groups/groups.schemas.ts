import { Static, Type } from "@sinclair/typebox";

export const UserParams = Type.Object({
  userId: Type.String({ format: "uuid" }),
});

export const GroupParams = Type.Object({
  userId: Type.String({ format: "uuid" }),
  groupId: Type.String({ format: "uuid" }),
});

export const ListGroupsQuery = Type.Object({
  role: Type.String(),
});

export const GetGroupQuery = Type.Object({
  role: Type.Optional(Type.String()),
});

export const JoinGroupBody = Type.Object({
  groupCode: Type.String(),
});

export type UserParams = Static<typeof UserParams>;
export type GroupParams = Static<typeof GroupParams>;
export type ListGroupsQuery = Static<typeof ListGroupsQuery>;
export type GetGroupQuery = Static<typeof GetGroupQuery>;
export type JoinGroupBody = Static<typeof JoinGroupBody>;
