import { GroupsRepository } from "../repositories";
import { UserRepository } from "../../users/repositories";
import { AppError } from "../../../shared/types";

const userRepository = new UserRepository();
const groupsRepository = new GroupsRepository();

export class GroupsService {
  async getUserMemberGroups(body: { userId: string; role: string }) {
    const userId = body.userId;

    const isUserExists = await userRepository.IsUserExistsId(userId);
    const userRole = await userRepository.getUserRoleById(userId);

    if (!isUserExists) {
      throw new AppError("User not found", 404);
    }

    if (String(userRole) !== body.role) {
      throw new AppError("User role does not match", 403);
    }

    const groupsData = groupsRepository.getUserGroups(userId);

    return groupsData;
  }

  async getGroup(body: { userId: string; groupId: string; role?: string }) {
    const userId = body.userId;
    const groupId = body.groupId;

    const isUserExists = await userRepository.IsUserExistsId(userId);
    if (!isUserExists) {
      throw new AppError("User not found", 404);
    }

    if (body.role) {
      const userRole = await userRepository.getUserRoleById(userId);
      if (String(userRole) !== body.role) {
        throw new AppError("User role does not match", 403);
      }
    }

    const group = await groupsRepository.getGroupById(groupId);
    if (!group) {
      throw new AppError("Group not found", 404);
    }

    return group;
  }

  async joinGroup(body: { userId: string; code: string }) {
    const userId = body.userId;

    const isUserExists = await userRepository.IsUserExistsId(userId);
    if (!isUserExists) {
      throw new AppError("User not found", 404);
    }

    const group = await groupsRepository.getGroupByCode(body.code);
    if (!group) {
      throw new AppError("Group not found", 404);
    }

    const isMember = await groupsRepository.isUserInGroup(userId, group.id);
    if (isMember) {
      throw new AppError("User is already a member of this group", 409);
    }

    await groupsRepository.joinGroup(userId, group.id);

    return groupsRepository.getGroupById(group.id);
  }

  private async IsGroupMember(userId: string, groupId: string) {
    const isMember = await groupsRepository.isUserInGroup(userId, groupId);

    return isMember ? true : false;
  }

  async getGroupMembers(body: { userId: string; groupId: string }) {
    const userId = body.userId;
    const groupId = body.groupId;

    const isUserExists = await userRepository.IsUserExistsId(userId);
    if (!isUserExists) {
      throw new AppError("User not found", 404);
    }

    const group = await groupsRepository.getGroupById(groupId);
    if (!group) {
      throw new AppError("Group not found", 404);
    }

    const isGroupMember = await this.IsGroupMember(userId, groupId);
    if (!isGroupMember) {
      throw new AppError("You are not member of this group", 403);
    }

    const groupMembers = await groupsRepository.getGroupMembers(groupId);

    console.log(groupMembers);

    return groupMembers;
  }
}
