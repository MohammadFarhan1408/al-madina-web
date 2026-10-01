import { describe, expect, it } from "vitest";
import { newPasswordSchema } from "./password";

describe("newPasswordSchema", () => {
  it("accepts 8+ chars with a letter and a digit", () => {
    expect(newPasswordSchema.safeParse("abcdefg1").success).toBe(true);
  });
  it.each(["abc123", "abcdefgh", "12345678"])("rejects %s", (pw) => {
    expect(newPasswordSchema.safeParse(pw).success).toBe(false);
  });
});
