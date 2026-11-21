// Public API of the groups module. Other modules may import ONLY from here.
export { createGroupsModule } from "./groups.module";
export type {
  CreateGroupData,
  GroupAuthorDto,
  GroupDetailsDto,
  GroupIdDto,
  GroupListDto,
  GroupListRecordDto,
  GroupMemberDto,
  GroupRecordDto,
  UpdateGroupData,
} from "./groups.types";
