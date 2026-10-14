import { describe, expect, it } from "vitest";
import { noteTiers } from "./spotlight";

describe("noteTiers", () => {
  it("splits an ordered note list top → heart → base", () => {
    expect(noteTiers(["Cardamom", "Incense", "Oud", "Leather", "Musk"])).toEqual([
      { tier: "Top", notes: ["Cardamom", "Incense"] },
      { tier: "Heart", notes: ["Oud", "Leather"] },
      { tier: "Base", notes: ["Musk"] },
    ]);
  });

  it("drops empty tiers for short lists", () => {
    expect(noteTiers(["Oud"])).toEqual([{ tier: "Top", notes: ["Oud"] }]);
    expect(noteTiers([])).toEqual([]);
  });
});
