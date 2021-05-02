import { matchResults } from "../__helpers__/utils";
import { problemMatcher as problemMatcherJson } from "../src/workspace-problem-matcher.json";
import { ProblemMatcher, ProblemPattern } from "github-actions-problem-matcher-typings";

const problemMatcher: ProblemMatcher = problemMatcherJson[0];

describe("problemMatcher", () => {
  it("has the correct owner", () => {
    expect(problemMatcher.owner).toEqual("dotnet-format");
  });

  it("has two patterns", () => {
    expect(problemMatcher.pattern.length).toEqual(2);
  });

  describe("pattern 1", () => {
    let pattern: ProblemPattern;

    beforeEach(() => {
      pattern = problemMatcher.pattern[0];
    });

    it("matches sln files", () => {
      const reportOutput = [
        "  Formatting code files in workspace 'C:\\dev\\application\\application.sln'.",
        "  src\\ConsoleApp\\Program.cs(5,18): Fix whitespace formatting 1.",
        "  src\\ConsoleApp\\Program.cs(8,30): Fix whitespace formatting 2.",
        "  Formatted code file 'Program.cs'.",
        "  Format complete in 4451ms.",
      ];

      const regexp = new RegExp(pattern.regexp);
      const results = matchResults(reportOutput, regexp);

      expect(results[0][pattern.fromPath]).toEqual("C:\\dev\\application\\application.sln");
    });

    it("matches csproj files", () => {
      const reportOutput = [
        "  Formatting code files in workspace 'C:\\dev\\application\\src\\ConsoleApp\\ConsoleApp.csproj'.",
        "  Program.cs(5,18): Fix whitespace formatting 1.",
        "  Program.cs(8,30): Fix whitespace formatting 2.",
        "  Formatted code file 'Program.cs'.",
        "  Format complete in 4451ms.",
      ];

      const regexp = new RegExp(pattern.regexp);
      const results = matchResults(reportOutput, regexp);

      expect(results[0][pattern.fromPath]).toEqual("C:\\dev\\application\\src\\ConsoleApp\\ConsoleApp.csproj");
    });

    it("matches vbproj files", () => {
      const reportOutput = [
        "  Formatting code files in workspace 'C:\\dev\\application\\src\\ConsoleApp\\ConsoleApp.vbproj'.",
        "  Program.vb(5,18): Fix whitespace formatting 1.",
        "  Program.vb(8,30): Fix whitespace formatting 2.",
        "  Formatted code file 'Program.vb'.",
        "  Format complete in 4451ms.",
      ];

      const regexp = new RegExp(pattern.regexp);
      const results = matchResults(reportOutput, regexp);

      expect(results[0][pattern.fromPath]).toEqual("C:\\dev\\application\\src\\ConsoleApp\\ConsoleApp.vbproj");
    });
  });

  describe("pattern 2", () => {
    const reportOutput = [
      "  Formatting code files in workspace 'C:\\dev\\application\\application.sln'.",
      "  src\\ConsoleApp\\Program.cs(5,18): Fix whitespace formatting 1.",
      "  src\\ConsoleApp\\Program.cs(8,30): Fix whitespace formatting 2.",
      "  Formatted code file 'Program.cs'.",
      "  Format complete in 4451ms.",
    ];

    let pattern: ProblemPattern;
    let results: RegExpExecArray[];

    beforeEach(() => {
      pattern = problemMatcher.pattern[1];

      const regexp = new RegExp(pattern.regexp);

      results = matchResults(reportOutput, regexp);
    });

    it("matches violations", () => {
      expect(results.length).toEqual(2);
    });

    it("matches violation details", () => {
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
