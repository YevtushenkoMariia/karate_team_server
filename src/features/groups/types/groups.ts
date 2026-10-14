import { Static, Type } from "@sinclair/typebox";


export const GroupBody = Type.Object({
    role: Type.String(),
});

export const GetGroupQuery = Type.Object({
    role: Type.Optional(Type.String()),
});

export const UserIdParams = Type.Object({
    userId: Type.String(),
});

export const GroupIdParams = Type.Object({
    userId: Type.String(),
    groupId: Type.String(),
});

export const JoinGroupSchema = Type.Object({
    groupCode: Type.String(),
});

export type GroupBody = Static<typeof GroupBody>;
export type GetGroupQuery = Static<typeof GetGroupQuery>;
export type UserIdParams = Static<typeof UserIdParams>;
export type GroupIdParams = Static<typeof GroupIdParams>;
export type JoinGroupBody = Static<typeof JoinGroupSchema>;

export type GetUserMemberGroupsRequest = {
  userId: string;
  role: string;
};

export type GetGroupRequest = {
  userId: string;
  groupId: string;
  role?: string;
};

export type JoinGroupRequest = {
  userId: string;
  code: string;
};

export type GroupMembersRequest = {
  userId: string;
  groupId: string;
};

export type UserIdRequest = {
  userId: string;
};

export type GroupIdRequest = {
  groupId: string;
};

export type GroupCodeRequest = {
  code: string;
};
