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
  groupCode: Type.String({ minLength: 1, maxLength: 20 }),
});

export const CreateGroupBody = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 100 }),
  description: Type.Optional(Type.String()),
});

export const UpdateGroupBody = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })),
  description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});

export const MemberParams = Type.Object({
  userId: Type.String({ format: "uuid" }),
  groupId: Type.String({ format: "uuid" }),
  memberId: Type.String({ format: "uuid" }),
});

export type UserParams = Static<typeof UserParams>;
export type GroupParams = Static<typeof GroupParams>;
export type ListGroupsQuery = Static<typeof ListGroupsQuery>;
export type GetGroupQuery = Static<typeof GetGroupQuery>;
export type JoinGroupBody = Static<typeof JoinGroupBody>;
export type CreateGroupBody = Static<typeof CreateGroupBody>;
export type UpdateGroupBody = Static<typeof UpdateGroupBody>;
export type MemberParams = Static<typeof MemberParams>;
