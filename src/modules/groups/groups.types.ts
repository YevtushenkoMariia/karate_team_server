import type { role_type } from "../../../generated/prisma/client";

export type GroupIdDto = {
  id: string;
};

export type GroupListRecordDto = {
  id: string;
  name: string;
  code: string;
  author_id: string | null;
  _count: { users_groups: number };
};

export type GroupRecordDto = GroupListRecordDto & {
  description: string | null;
};

export type CreateGroupData = {
  name: string;
  description?: string;
  code: string;
  authorId: string;
};

export type UpdateGroupData = {
  name?: string;
  description?: string | null;
};

export type GroupAuthorDto = {
  name: string | undefined;
  surname: string | undefined;
};

export type GroupListDto = {
  id: string;
  name: string;
  code: string;
  author: GroupAuthorDto;
  membersCount: number;
};

export type GroupDetailsDto = GroupListDto & {
  description: string | null;
};

export type GroupMemberDto = {
  id: string;
  name: string;
  surname: string;
  role: role_type;
};
