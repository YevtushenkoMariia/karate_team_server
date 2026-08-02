import { role_type } from "../../generated/prisma/client";
import { JwtUser } from "../plugins/auth";
import { ProileBody, UpdateUserBody } from "../schemas/user";
import { UserRepository } from "../repositories/user";

const repository = new UserRepository();

export class UsersService {
  async getUserProfile(body: ProileBody) {
    const userId = Number(body.userId);

    const isUserExists = await repository.IsUserExistsId(userId);
    const userRole = await repository.getUserRoleById(userId);

    if (!isUserExists) {
      throw new Error("User not found");
    }

    if (String(userRole) !== body.role) {
      throw new Error("User role does not match");
    }

    return repository.getUserProfileById(userId);
  }

  async updateUserProfile(authUser: JwtUser, body: UpdateUserBody) {
    const userId = authUser.id;
    const role = authUser.role;

    const isUserExists = await repository.IsUserExistsId(userId);
    if (!isUserExists) {
      throw new Error("User not found");
    }

    const currentRole = await repository.getUserRoleById(userId);
    if (currentRole !== role) {
      throw new Error("User role does not match");
    }

    if (role === role_type.ADMIN) {
      return repository.updateUserProfile({
        userId,
        role,
        name: body.name,
        surname: body.surname,
        email: body.email,
        gender: body.gender,
        phone_number: body.phone_number,
        birth_date: body.birth_date ? new Date(body.birth_date) : undefined,
      });
    }

    if (role === role_type.COACH) {
      return repository.updateUserProfile({
        userId,
        role,
        name: body.name,
        surname: body.surname,
        email: body.email,
        gender: body.gender,
        phone_number: body.phone_number,
        birth_date: body.birth_date ? new Date(body.birth_date) : undefined,
        cityName: body.city,
        clubName: body.club,
        karate_level: body.karate_level,
        position: body.position,
        specialization: body.specialization,
      });
    }

    // SPORTSMAN
    return repository.updateUserProfile({
      userId,
      role,
      name: body.name,
      surname: body.surname,
      email: body.email,
      gender: body.gender,
      phone_number: body.phone_number,
      birth_date: body.birth_date ? new Date(body.birth_date) : undefined,
      cityName: body.city,
      clubName: body.club,
      karate_level: body.karate_level,
      status: body.status,
    });
  }
}
