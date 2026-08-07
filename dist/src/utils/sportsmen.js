"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKarateLevel = toKarateLevel;
exports.toSportsmanStatus = toSportsmanStatus;
const client_1 = require("../../generated/prisma/client");
const KARATE_LEVEL_DB_TO_ENUM = {
    "0_KYU": client_1.karate_level_type.KYU_1,
    "10_KYU": client_1.karate_level_type.KYU_10,
    "9_KYU": client_1.karate_level_type.KYU_9,
    "8_KYU": client_1.karate_level_type.KYU_8,
    "7_KYU": client_1.karate_level_type.KYU_7,
    "6_KYU": client_1.karate_level_type.KYU_6,
    "5_KYU": client_1.karate_level_type.KYU_5,
    "4_KYU": client_1.karate_level_type.KYU_4,
    "3_KYU": client_1.karate_level_type.KYU_3,
    "2_KYU": client_1.karate_level_type.KYU_2,
    "1_KYU": client_1.karate_level_type.KYU_1,
    "1_DAN": client_1.karate_level_type.DAN_1,
    "2_DAN": client_1.karate_level_type.DAN_2,
    "3_DAN": client_1.karate_level_type.DAN_3,
    "4_DAN": client_1.karate_level_type.DAN_4,
    "5_DAN": client_1.karate_level_type.DAN_5,
    "6_DAN": client_1.karate_level_type.DAN_6,
    "7_DAN": client_1.karate_level_type.DAN_7,
    "8_DAN": client_1.karate_level_type.DAN_8,
    "9_DAN": client_1.karate_level_type.DAN_9,
    "10_DAN": client_1.karate_level_type.DAN_10,
};
const KARATE_LEVEL_ENUM_VALUES = new Set(Object.values(client_1.karate_level_type));
const SPORTSMAN_STATUS_VALUES = new Set(Object.values(client_1.sportsman_role_type));
function toKarateLevel(value) {
    if (!value?.trim()) {
        return undefined;
    }
    const normalized = value.trim().toUpperCase();
    if (KARATE_LEVEL_ENUM_VALUES.has(normalized)) {
        return normalized;
    }
    const mapped = KARATE_LEVEL_DB_TO_ENUM[normalized];
    if (mapped) {
        return mapped;
    }
    throw new Error(`Invalid karate_level "${value}". Use values like KYU_9 or 9_KYU.`);
}
function toSportsmanStatus(value) {
    if (!value?.trim()) {
        return undefined;
    }
    const normalized = value.trim().toUpperCase();
    if (SPORTSMAN_STATUS_VALUES.has(normalized)) {
        return normalized;
    }
    throw new Error(`Invalid status "${value}". Expected JUST_TRAIN, RESERVE, or NATIONAL_TEAM.`);
}
