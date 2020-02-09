import { problemMatcher } from "../.github/dotnet-format-problem-matcher.json";

export interface ProblemMatcher {
  owner: string;
  pattern: ProblemMatcherPattern[];
};

export interface ProblemMatcherPattern {
  regexp: string;
  file?: number;
  line?: number;
  column?: number;
  severity?: number;
  message?: number;
  code?: number;
  loop?: boolean;
}

export const dotnetFormatMatcher: ProblemMatcher = problemMatcher[0];
