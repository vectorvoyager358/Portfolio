import { describe, expect, it } from "vitest";
import { privacyPolicy } from "@/data/privacy";
import { profile } from "@/data/profile";

describe("privacyPolicy", () => {
  it("covers chatbot, voice, local storage, and contact", () => {
    const headings = privacyPolicy.sections.map((s) => s.heading);
    expect(headings).toContain("What data is collected");
    expect(headings).toContain("Third parties");
    expect(headings).toContain("Cookies and local storage");
    expect(headings).toContain("Contact");

    const blob = JSON.stringify(privacyPolicy);
    expect(blob).toContain("Ask Jeethesh");
    expect(blob).toContain("NVIDIA");
    expect(blob).toContain("localStorage");
    expect(blob).toContain(profile.email);
  });
});
