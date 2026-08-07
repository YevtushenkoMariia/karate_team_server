"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRepository = exports.AdminRepository = void 0;
class AdminRepository {
    async buildAdminProfile(user) {
        if (!user || user.role !== "ADMIN") {
            return null;
        }
        return {
            id: user.id,
            name: user.name,
            surname: user.surname,
            role: user.role,
            email: user.email,
            gender: user.gender,
            phone_number: user.phone_number,
            birth_date: user.birth_date,
        };
    }
}
exports.AdminRepository = AdminRepository;
exports.adminRepository = new AdminRepository();
