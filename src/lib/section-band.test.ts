import { describe, expect, it } from "vitest";
import { SECTION_BANDS, sectionBandClass } from "@/lib/section-band";

describe("section bands", () => {
  it("alternates muted and clear after the hero", () => {
    expect(SECTION_BANDS.hero).toBe("hero");
    expect(SECTION_BANDS.experience).toBe("muted");
    expect(SECTION_BANDS.work).toBe("clear");
    expect(SECTION_BANDS.education).toBe("muted");
    expect(SECTION_BANDS.capabilities).toBe("clear");
    expect(SECTION_BANDS.certifications).toBe("muted");
    expect(SECTION_BANDS.ask).toBe("clear");
    expect(SECTION_BANDS.contact).toBe("clear");
  });

  it("maps bands to CSS class pairs", () => {
    expect(sectionBandClass("hero")).toContain("section-band-hero");
    expect(sectionBandClass("muted")).toContain("section-band-muted");
    expect(sectionBandClass("clear")).toContain("section-band-clear");
  });
});
