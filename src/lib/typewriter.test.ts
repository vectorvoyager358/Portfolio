import { describe, expect, it } from "vitest";
import {
  deleteLastWord,
  nextTypewriterStep,
  typeNextChar,
} from "@/lib/typewriter";

describe("typewriter helpers", () => {
  it("types the next character", () => {
    expect(typeNextChar("", "Systems")).toBe("S");
    expect(typeNextChar("Sys", "Systems")).toBe("Syst");
  });

  it("deletes the last word", () => {
    expect(deleteLastWord("Multi Agent Builder ")).toBe("Multi Agent ");
    expect(deleteLastWord("Builder")).toBe("");
  });

  it("pauses then deletes after a full phrase", () => {
    const roles = ["AI Engineer", "Builder"];
    const pause = nextTypewriterStep(
      { displayText: "AI Engineer", roleIndex: 0, isDeleting: false },
      roles,
    );
    expect(pause.kind).toBe("pause");
    expect(pause.state.isDeleting).toBe(true);

    const deleted = nextTypewriterStep(pause.state, roles);
    expect(deleted.kind).toBe("delete");
    expect(deleted.state.displayText).toBe("AI ");
  });

  it("advances to the next role after clearing", () => {
    const roles = ["AI Engineer", "Builder"];
    const advance = nextTypewriterStep(
      { displayText: "", roleIndex: 0, isDeleting: true },
      roles,
    );
    expect(advance.kind).toBe("advance");
    expect(advance.state.roleIndex).toBe(1);
    expect(advance.state.isDeleting).toBe(false);
  });
});
