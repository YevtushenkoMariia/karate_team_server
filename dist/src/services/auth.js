"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_1 = require("../repositories/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const repository = new user_1.UserRepository();
class AuthService {
    async registerUser(data) {
        if (data.password !== data.confirmPassword) {
            logger_1.logger.error("Passwords do not matchs");
            return {
                success: false,
                message: "Passwords do not matchs",
                code: 400,
            };
        }
        const user = await repository.checkUserExists(data.email);
        if (user) {
            logger_1.logger.error("User already exists");
            return {
                success: false,
                message: "User already exists",
                code: 400,
            };
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
        const newUser = await repository.createUser({
            name: data.name,
            surname: data.surname,
            email: data.email,
            password: hashedPassword,
            role: data.role,
        });
        const token = jwt.sign({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        logger_1.logger.info("User registered successfully");
        const { password: _, ...userWithoutPassword } = newUser;
        return {
            success: true,
            message: "User registered successfully",
            code: 201,
            user: userWithoutPassword,
            token,
        };
    }
    async loginUser(data) {
        const user = await repository.checkUserExists(data.email);
        if (!user) {
            logger_1.logger.error("User not found");
            return {
                success: false,
                message: "User not found",
                code: 404,
            };
        }
        const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.password);
        if (!isPasswordValid) {
            logger_1.logger.error("Invalid password");
            return {
                success: false,
                message: "Invalid password",
                code: 401,
            };
        }
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        logger_1.logger.info("User logged in successfully");
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
exports.AuthService = AuthService;
