"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const client_1 = require("../../../../generated/prisma/client");
const repositories_1 = require("../repositories");
const types_1 = require("../../../shared/types");
const utils_1 = require("../../sportsmen/utils");
const repositories_2 = require("../../sportsmen/repositories");
const repositories_3 = require("../../locations/repositories");
const repository = new repositories_1.UserRepository();
class UsersService {
    async getUserProfile(body) {
        const userId = body.userId;
        const isUserExists = await repository.IsUserExistsId(userId);
        const userRole = await repository.getUserRoleById(userId);
        if (!isUserExists) {
            throw new types_1.AppError("User not found", 404);
        }
        if (String(userRole) !== body.role) {
            throw new types_1.AppError("User role does not match", 403);
        }
        const userProfile = repository.getUserProfileById(userId);
        return userProfile;
    }
    async updateUserProfile(authUser, body) {
        const userId = authUser.id;
        const role = authUser.role;
        const isUserExists = await repository.IsUserExistsId(userId);
        if (!isUserExists) {
            throw new types_1.AppError("User not found", 404);
        }
        const currentRole = await repository.getUserRoleById(userId);
        if (currentRole !== role) {
            throw new types_1.AppError("User role does not match", 403);
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
        const karateLevel = (0, utils_1.toKarateLevel)(body.karate_level);
        const sportsmanStatus = (0, utils_1.toSportsmanStatus)(body.status);
        let cityId = null;
        if (body.city?.trim()) {
            cityId = await repositories_3.locationRepository.findOrCreateCity(body.city.trim());
        }
        let clubId = null;
        if (body.club?.trim()) {
            clubId = await repositories_3.locationRepository.findOrCreateClub(body.club.trim(), cityId);
        }
        if (role === client_1.role_type.COACH) {
            await repositories_1.coachRepository.upsertCoach(userId, {
                city_id: cityId,
                club_id: clubId,
                karate_level: karateLevel,
                position: body.position,
                specialization: body.specialization,
            });
        }
        else if (role === client_1.role_type.SPORTSMAN) {
            await repositories_2.sportsmenRepository.upsertSportsmen(userId, {
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
