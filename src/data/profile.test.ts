import { describe, expect, it } from "vitest";
import {
  buildGroundingContext,
  buildSystemPrompt,
  profile,
} from "@/data/profile";

describe("profile grounding", () => {
  it("includes pinned projects and Halliburton experience", () => {
    const context = buildGroundingContext();
    expect(context).toContain("Resilience Hub");
    expect(context).toContain("VoxWire");
    expect(context).toContain("Local LLM Inference Bench");
    expect(context).toContain("Moment Keeper");
    expect(context).toContain("Halliburton");
    expect(context).toContain(profile.email);
  });

  it("scopes the system prompt to grounded profile answers", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("Ask Jeethesh");
    expect(prompt).toContain("Only answer using the grounded profile context");
    expect(prompt).toContain("<profile_context>");
    expect(prompt).toContain(profile.summary.slice(0, 40));
    expect(prompt).toContain("first person");
    expect(prompt).toContain("Markdown");
  });

  it("includes focus areas for experience narrative", () => {
    expect(profile.focusAreas.length).toBeGreaterThanOrEqual(4);
  });

  it("exposes four projects matching GitHub pins", () => {
    expect(profile.projects).toHaveLength(4);
    expect(profile.projects.map((p) => p.id)).toEqual([
      "resilience-hub",
      "voxwire",
      "local-llm-bench",
      "moment-keeper",
    ]);
  });

  it("includes a hiring question among starter prompts", () => {
    expect(profile.suggestedPrompts).toContain("Why hire Jeethesh?");
  });

  it("includes rotating greeting roles for the hero typewriter", () => {
    expect(profile.greetingRoles.length).toBeGreaterThanOrEqual(3);
    expect(profile.greetingLead.length).toBeGreaterThan(10);
    expect(profile.greetingBeamTerms).toEqual(["Evals", "Grounding", "Ops"]);
  });

  it("exposes persona avatar paths for chat and hero", () => {
    expect(profile.personaAvatar).toBe("/avatar-sm-v9.jpg");
    expect(profile.personaAvatarFull).toBe("/avatar-v9.jpg");
  });

  it("includes spoken languages in profile data", () => {
    expect(profile.languages.map((l) => l.name)).toEqual([
      "English",
      "Telugu",
      "Hindi",
      "Spanish",
    ]);
    expect(buildGroundingContext()).toContain("Telugu: Native");
    expect(buildGroundingContext()).toContain("Still buffering");
  });

  it("exposes contact CTA copy for the footer", () => {
    expect(profile.contactCta.title).toBe("Let's talk");
    expect(profile.contactCta.contactLabel).toBe("Contact");
    expect(profile.contactCta.description.length).toBeGreaterThan(20);
  });
});
