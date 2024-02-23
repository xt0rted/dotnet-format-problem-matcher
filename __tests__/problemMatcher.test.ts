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
      "/path/file.cs(15,2): error WHITESPACE: Fix whitespace formatting. Insert '\t'. [/path/project.csproj]",
      "/path/file.cs(15,3): error WHITESPACE: Fix whitespace formatting. Replace 4 characters with '\n\t\t\t'. [/path/project.csproj]",
      "/path/file.cs(16,84): error WHITESPACE: Fix whitespace formatting. Replace 4 characters with '\n\t\t\t'. [/path/project.csproj]",
    ];

    let pattern: ProblemPattern;
    let results: RegExpExecArray[];

    beforeEach(() => {
      pattern = problemMatcher.pattern[0];

      const regexp = new RegExp(pattern.regexp);

      results = matchResults(reportOutput, regexp);
    });

    it("matches violations", () => {
      expect(results.length).toEqual(3);
    });

    it("matches violation details", () => {
      expect(results[0][pattern.file]).toEqual("/path/file.cs");
      expect(results[0][pattern.line]).toEqual("15");
      expect(results[0][pattern.column]).toEqual("2");
      expect(results[0][pattern.message]).toEqual("Fix whitespace formatting. Insert '\t'.");
      expect(results[0][pattern.severity]).toEqual("error");
      expect(results[0][pattern.code]).toEqual("WHITESPACE");

      expect(results[1][pattern.file]).toEqual("/path/file.cs");
      expect(results[1][pattern.line]).toEqual("15");
      expect(results[1][pattern.column]).toEqual("3");
      expect(results[1][pattern.message]).toEqual("Fix whitespace formatting. Replace 4 characters with '\n\t\t\t'.");

      expect(results[2][pattern.file]).toEqual("/path/file.cs");
      expect(results[2][pattern.line]).toEqual("16");
      expect(results[2][pattern.column]).toEqual("84");
      expect(results[2][pattern.message]).toEqual("Fix whitespace formatting. Replace 4 characters with '\n\t\t\t'.");
    });
  });
});
