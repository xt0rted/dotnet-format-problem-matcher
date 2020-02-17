import { matchResults } from "../__helpers__/utils";
import { problemMatcher as problemMatcherJson } from "../.github/dotnet-format-problem-matcher.json";
import { ProblemMatcher, ProblemPattern } from "github-actions-problem-matcher-typings";

const problemMatcher = problemMatcherJson[0] as ProblemMatcher;

describe("problemMatcher", () => {
  it("has one pattern", () => {
    expect(problemMatcher.pattern.length).toEqual(1);
  });

  describe("pattern", () => {
    const reportOutput = [
      "  Formatting code files in workspace 'C:\\dev\\application\\application.sln'.",
      "  src\\ConsoleApp\\Program.cs(5,18): Fix whitespace formatting 1.",
      "  src\\ConsoleApp\\Program.cs(8,30): Fix whitespace formatting 2.",
      "  Formatted code file 'Program.cs'.",
      "  Format complete in 4451ms.",
    ];

    let pattern: ProblemPattern;
    let regexp: RegExp;

    beforeEach(() => {
      pattern = problemMatcher.pattern[0];
      regexp = new RegExp(pattern.regexp);
    });

    it("matches violations", () => {
      const results = matchResults(reportOutput, regexp);

      expect(results.length).toEqual(2);
    });

    it("matches violation details", () => {
      const results = matchResults(reportOutput, regexp);

      expect(results.length).toEqual(2);

      expect(results[0][pattern.file]).toEqual("src\\ConsoleApp\\Program.cs");
      expect(results[0][pattern.line]).toEqual("5");
      expect(results[0][pattern.column]).toEqual("18");
      expect(results[0][pattern.message]).toEqual("Fix whitespace formatting 1.");

      expect(results[1][pattern.file]).toEqual("src\\ConsoleApp\\Program.cs");
      expect(results[1][pattern.line]).toEqual("8");
      expect(results[1][pattern.column]).toEqual("30");
      expect(results[1][pattern.message]).toEqual("Fix whitespace formatting 2.");
    });
  });
});
