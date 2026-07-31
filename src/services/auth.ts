import { UserRepository } from "../repositories/user";
import { AuthBody, LoginBody } from "../schemas/auth";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { logger } from "../utils/logger";

const repository = new UserRepository();

export class AuthService {

  async registerUser(data: AuthBody) {
    if(data.password !== data.confirmPassword){
      logger.error("Passwords do not matchs");
      return {
        success: false,
        message: "Passwords do not matchs",
        code: 400,
      };
    }
    
    const user = await repository.checkUserExists(data.email);
    if (user) {
      logger.error("User already exists");
      return {
        success: false,
        message: "User already exists",
        code: 400,
      };
    }


    const hashedPassword = await bcrypt.hash(data.password, 12);

    const newUser = await repository.createUser({
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
    );

    logger.info("User registered successfully");
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      success: true,
      message: "User registered successfully",
      code: 201,
      user: userWithoutPassword,
      token,
    };
  }

  async loginUser(data: LoginBody) {
    const user = await repository.checkUserExists(data.email);
    if (!user) {
     logger.error("User not found");
      return {
        success: false,
        message: "User not found",
        code: 404,
      };
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      logger.error("Invalid password");
      return {
        success: false,
        message: "Invalid password",
        code: 401,
      };
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
    );

    logger.info("User logged in successfully");
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      success: true,
      message: "User logged in successfully",
      code: 200,
      user: userWithoutPassword,
      token,
    };
  }
}
