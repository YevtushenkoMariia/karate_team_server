import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { karate_level_type } from "../generated/prisma/client";
import { toKarateLevel } from "../src/modules/members/karate";

describe("toKarateLevel", () => {
  it("maps 0_KYU to KYU_0", () => {
    assert.equal(toKarateLevel("0_KYU"), karate_level_type.KYU_0);
  });
});
