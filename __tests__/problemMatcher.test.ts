import { matchResults } from "../__helpers__/utils";
import { problemMatcher as problemMatcherJson } from "../src/problem-matcher.json";
import { ProblemMatcher, ProblemPattern } from "github-actions-problem-matcher-typings";

const problemMatcher: ProblemMatcher = problemMatcherJson[0];

describe("problemMatcher", () => {
  it("has the correct owner", () => {
    expect(problemMatcher.owner).toEqual("dotnet-format");
  });

  it("has one pattern", () => {
    expect(problemMatcher.pattern.length).toEqual(1);
  });

  describe("pattern", () => {
    const reportOutput = [
      "src\\ConsoleApp\\Program.cs(3,3): error WHITESPACE: Fix whitespace formatting. Insert '\\s\\s'. [src\\ConsoleApp\\ConsoleApp.csproj]",
      "src\\ConsoleApp\\Program.cs(1,1): warning IDE0161: Convert to file-scoped namespace [src\\ConsoleApp\\ConsoleApp.csproj]",
    ];

    let pattern: ProblemPattern;
    let results: RegExpExecArray[];

    beforeEach(() => {
      pattern = problemMatcher.pattern[0];

      const regexp = new RegExp(pattern.regexp);

      results = matchResults(reportOutput, regexp);
    });

    it("matches violations", () => {
      expect(results.length).toEqual(2);
    });

    it("matches violation details", () => {
      expect(results[0][pattern.file]).toEqual("src\\ConsoleApp\\Program.cs");
      expect(results[0][pattern.line]).toEqual("3");
      expect(results[0][pattern.column]).toEqual("3");
      expect(results[0][pattern.severity]).toEqual("error");
      expect(results[0][pattern.code]).toEqual("WHITESPACE");
      expect(results[0][pattern.message]).toEqual("Fix whitespace formatting. Insert '\\s\\s'.");

      expect(results[1][pattern.file]).toEqual("src\\ConsoleApp\\Program.cs");
      expect(results[1][pattern.line]).toEqual("1");
      expect(results[1][pattern.column]).toEqual("1");
      expect(results[1][pattern.severity]).toEqual("warning");
      expect(results[1][pattern.code]).toEqual("IDE0161");
      expect(results[1][pattern.message]).toEqual("Convert to file-scoped namespace");
    });
  });
});
