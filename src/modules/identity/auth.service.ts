import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import {
  BadRequestError,
  ConflictError,
  EventBus,
  JwtUser,
  logger,
  UnauthorizedError,
} from "../../shared";
import type {
  AuthUserStore,
  LoginResult,
  RegisterResult,
  UserRecord,
} from "./identity.types";
import { UserRegistered } from "./identity.events";
import { LoginBody, RegisterBody } from "./auth.schemas";

type TokenOptions = {
  secret: string;
  expiresIn: string;
};

export class AuthService {
  constructor(
    private readonly users: AuthUserStore,
    private readonly events: EventBus,
    private readonly tokenOptions: TokenOptions,
  ) {}

  async register(data: RegisterBody): Promise<RegisterResult> {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestError("Passwords do not match");
    }

    if (await this.users.findByEmail(data.email)) {
      throw new ConflictError("User already exists");
    }

    const user = await this.users.create({
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: await bcrypt.hash(data.password, 12),
      role: data.role,
    });

    await this.events.publish(UserRegistered, {
      userId: user.id,
      role: user.role,
    });

    logger.info({ userId: user.id }, "User registered successfully");
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      message: "User registered successfully",
      code: 201,
      user: userWithoutPassword,
      token: this.signToken(user),
    };
  }

  async login(data: LoginBody): Promise<LoginResult> {
    const user = await this.users.findByEmail(data.email);
    const isPasswordValid =
      user !== null && (await bcrypt.compare(data.password, user.password));

    // Same answer for unknown email and wrong password, so the endpoint
    // does not reveal which emails are registered.
    if (!user || !isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    logger.info({ userId: user.id }, "User logged in successfully");
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      message: "User logged in successfully",
      code: 200,
      user: userWithoutPassword,
      token: this.signToken(user),
    };
  }

  private signToken(user: Pick<UserRecord, "id" | "email" | "role">): string {
    const payload: JwtUser = { id: user.id, email: user.email, role: user.role };

    return jwt.sign(payload, this.tokenOptions.secret, {
      expiresIn: this.tokenOptions.expiresIn as jwt.SignOptions["expiresIn"],
    });
  }
}
