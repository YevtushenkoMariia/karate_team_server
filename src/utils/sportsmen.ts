import {
  karate_level_type,
  sportsman_role_type,
} from "../../generated/prisma/client";

const KARATE_LEVEL_DB_TO_ENUM: Record<string, karate_level_type> = {
  "10_KYU": karate_level_type.KYU_10,
  "9_KYU": karate_level_type.KYU_9,
  "8_KYU": karate_level_type.KYU_8,
  "7_KYU": karate_level_type.KYU_7,
  "6_KYU": karate_level_type.KYU_6,
  "5_KYU": karate_level_type.KYU_5,
  "4_KYU": karate_level_type.KYU_4,
  "3_KYU": karate_level_type.KYU_3,
  "2_KYU": karate_level_type.KYU_2,
  "1_KYU": karate_level_type.KYU_1,
  "1_DAN": karate_level_type.DAN_1,
  "2_DAN": karate_level_type.DAN_2,
  "3_DAN": karate_level_type.DAN_3,
  "4_DAN": karate_level_type.DAN_4,
  "5_DAN": karate_level_type.DAN_5,
  "6_DAN": karate_level_type.DAN_6,
  "7_DAN": karate_level_type.DAN_7,
  "8_DAN": karate_level_type.DAN_8,
  "9_DAN": karate_level_type.DAN_9,
  "10_DAN": karate_level_type.DAN_10,
};

const KARATE_LEVEL_ENUM_VALUES = new Set<string>(
  Object.values(karate_level_type),
);

const SPORTSMAN_STATUS_VALUES = new Set<string>(
  Object.values(sportsman_role_type),
);

export function toKarateLevel(
  value?: string | null,
): karate_level_type | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const normalized = value.trim().toUpperCase();

  if (KARATE_LEVEL_ENUM_VALUES.has(normalized)) {
    return normalized as karate_level_type;
  }

  const mapped = KARATE_LEVEL_DB_TO_ENUM[normalized];
  if (mapped) {
    return mapped;
  }

  throw new Error(
    `Invalid karate_level "${value}". Use values like KYU_9 or 9_KYU.`,
  );
}

export function toSportsmanStatus(
  value?: string | null,
): sportsman_role_type | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const normalized = value.trim().toUpperCase();
  if (SPORTSMAN_STATUS_VALUES.has(normalized)) {
    return normalized as sportsman_role_type;
  }

  throw new Error(
    `Invalid status "${value}". Expected JUST_TRAIN, RESERVE, or NATIONAL_TEAM.`,
  );
}
