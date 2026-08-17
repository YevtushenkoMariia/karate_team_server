"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const client_1 = require("../../generated/prisma/client");
const user_1 = require("../repositories/user");
const error_1 = require("../types/error");
const coach_1 = require("../repositories/coach");
const sportsmen_1 = require("../utils/sportsmen");
const sportsmen_2 = require("../repositories/sportsmen");
const locations_1 = require("../repositories/locations");
const repository = new user_1.UserRepository();
class UsersService {
    async getUserProfile(body) {
        const userId = Number(body.userId);
        const isUserExists = await repository.IsUserExistsId(userId);
        const userRole = await repository.getUserRoleById(userId);
        if (!isUserExists) {
            throw new error_1.AppError("User not found", 404);
        }
        if (String(userRole) !== body.role) {
            throw new error_1.AppError("User role does not match", 403);
        }
        const userProfile = repository.getUserProfileById(userId);
        return userProfile;
    }
    async updateUserProfile(authUser, body) {
        const userId = authUser.id;
        const role = authUser.role;
        const isUserExists = await repository.IsUserExistsId(userId);
        if (!isUserExists) {
            throw new error_1.AppError("User not found", 404);
        }
        const currentRole = await repository.getUserRoleById(userId);
        if (currentRole !== role) {
            throw new error_1.AppError("User role does not match", 403);
        }
        await repository.updateUserProfile({
            userId,
            role,
            name: body.name,
            surname: body.surname,
            email: body.email,
            gender: body.gender,
            phone_number: body.phone_number,
            birth_date: body.birth_date ? new Date(body.birth_date) : undefined,
        });
        const karateLevel = (0, sportsmen_1.toKarateLevel)(body.karate_level);
        const sportsmanStatus = (0, sportsmen_1.toSportsmanStatus)(body.status);
        let cityId = null;
        if (body.city?.trim()) {
            cityId = await locations_1.locationRepository.findOrCreateCity(body.city.trim());
        }
        let clubId = null;
        if (body.club?.trim()) {
            clubId = await locations_1.locationRepository.findOrCreateClub(body.club.trim(), cityId);
        }
        if (role === client_1.role_type.COACH) {
            await coach_1.coachRepository.upsertCoach(userId, {
                city_id: cityId,
                club_id: clubId,
                karate_level: karateLevel,
                position: body.position,
                specialization: body.specialization,
            });
        }
        else if (role === client_1.role_type.SPORTSMAN) {
            await sportsmen_2.sportsmenRepository.upsertSportsmen(userId, {
                city_id: cityId,
                club_id: clubId,
                karate_level: karateLevel,
                status: sportsmanStatus,
            });
        }
        return repository.getUserProfileById(userId);
    }
}
exports.UsersService = UsersService;
