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
exports.authorize = authorize;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const jwt = __importStar(require("jsonwebtoken"));
async function authPlugin(fastify) {
    fastify.decorate("authenticate", async (request, reply) => {
        const header = request.headers.authorization;
        if (!header?.startsWith("Bearer ")) {
            return reply.status(401).send({ message: "Unauthorized" });
        }
        const token = header.slice("Bearer ".length);
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return reply.status(500).send({ message: "JWT secret is not configured" });
        }
        try {
            request.user = jwt.verify(token, secret);
        }
        catch {
            return reply.status(401).send({ message: "Invalid or expired token" });
        }
    });
}
function authorize(...roles) {
    return async (request, reply) => {
        if (!request.user) {
            return reply.status(401).send({ message: "Unauthorized" });
        }
        if (!roles.includes(request.user.role)) {
            return reply.status(403).send({ message: "Forbidden" });
        }
    };
}
exports.default = (0, fastify_plugin_1.default)(authPlugin);
