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
        const userId = Number(body.userId);
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
}
exports.GroupsService = GroupsService;
