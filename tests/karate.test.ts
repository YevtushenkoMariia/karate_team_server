import { describe, expect, it } from "vitest";
import { karate_level_type } from "../generated/prisma/client";
import { toKarateLevel } from "../src/modules/members/karate";

describe("toKarateLevel", () => {
  it("maps 0_KYU to KYU_0", () => {
    expect(toKarateLevel("0_KYU")).toBe(karate_level_type.KYU_0);
  });
});
