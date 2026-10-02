import { describe, expect, it } from "vitest";
import { buildCheckoutAddressSchema } from "./schema";

const base = { fullName: "Aisha K", phone: "0501234567", address: "Marina 12", city: "Dubai" };

describe("checkout address schema", () => {
  it("requires an email for guests", () => {
    expect(buildCheckoutAddressSchema(true).safeParse({ ...base, email: "" }).success).toBe(false);
    expect(buildCheckoutAddressSchema(true).safeParse({ ...base, email: "a@b.co" }).success).toBe(true);
  });
  it("lets signed-in users omit the email", () => {
    expect(buildCheckoutAddressSchema(false).safeParse(base).success).toBe(true);
    expect(buildCheckoutAddressSchema(false).safeParse({ ...base, email: "" }).success).toBe(true);
  });
});
