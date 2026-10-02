import { describe, expect, it } from "vitest";
import { computeShipping } from "./shipping";

describe("computeShipping", () => {
  it("is free for an empty bag and at/above 250", () => {
    expect(computeShipping(0)).toBe(0);
    expect(computeShipping(250)).toBe(0);
  });
  it("is a flat 20 below the threshold", () => {
    expect(computeShipping(249)).toBe(20);
  });
  it("adds 30 for express, even when standard is free", () => {
    expect(computeShipping(300, "express")).toBe(30);
    expect(computeShipping(100, "express")).toBe(50);
  });
});
