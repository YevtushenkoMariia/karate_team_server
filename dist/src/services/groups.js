"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsService = void 0;
const groups_1 = require("../repositories/groups");
const user_1 = require("../repositories/user");
const error_1 = require("../types/error");
const userRepository = new user_1.UserRepository();
const groupsRepository = new groups_1.GroupsRepository();
class GroupsService {
    async getUserMemberGroups(body) {
        const userId = body.userId;
        const isUserExists = await userRepository.IsUserExistsId(userId);
        const userRole = await userRepository.getUserRoleById(userId);
        if (!isUserExists) {
            throw new error_1.AppError("User not found", 404);
        }
        if (String(userRole) !== body.role) {
            throw new error_1.AppError("User role does not match", 403);
        }
        const groupsData = groupsRepository.getUserGroups(userId);
        return groupsData;
    }
    async getGroup(body) {
        const userId = body.userId;
        const groupId = body.groupId;
        const isUserExists = await userRepository.IsUserExistsId(userId);
        if (!isUserExists) {
            throw new error_1.AppError("User not found", 404);
        }
        if (body.role) {
            const userRole = await userRepository.getUserRoleById(userId);
            if (String(userRole) !== body.role) {
                throw new error_1.AppError("User role does not match", 403);
            }
        }
        const group = await groupsRepository.getGroupById(groupId);
        if (!group) {
            throw new error_1.AppError("Group not found", 404);
        }
        return group;
    }
    async joinGroup(body) {
        const userId = body.userId;
        const isUserExists = await userRepository.IsUserExistsId(userId);
        if (!isUserExists) {
            throw new error_1.AppError("User not found", 404);
        }
        const group = await groupsRepository.getGroupByCode(body.code);
        if (!group) {
            throw new error_1.AppError("Group not found", 404);
        }
        const isMember = await groupsRepository.isUserInGroup(userId, group.id);
        if (isMember) {
            throw new error_1.AppError("User is already a member of this group", 409);
        }
        await groupsRepository.joinGroup(userId, group.id);
        return groupsRepository.getGroupById(group.id);
    }
    async IsGroupMember(userId, groupId) {
        const isMember = await groupsRepository.isUserInGroup(userId, groupId);
        return isMember ? true : false;
    }
    async getGroupMembers(body) {
        const userId = body.userId;
        const groupId = body.groupId;
        const isUserExists = await userRepository.IsUserExistsId(userId);
        if (!isUserExists) {
            throw new error_1.AppError("User not found", 404);
        }
        const group = await groupsRepository.getGroupById(groupId);
        if (!group) {
            throw new error_1.AppError("Group not found", 404);
        }
        const isGroupMember = await this.IsGroupMember(userId, groupId);
        if (!isGroupMember) {
            throw new error_1.AppError("You are not member of this group", 403);
        }
        const groupMembers = await groupsRepository.getGroupMembers(groupId);
        console.log(groupMembers);
        return groupMembers;
    }
}
exports.GroupsService = GroupsService;
