# dotnet-format Problem Matcher

[![CI Workflow Status](https://github.com/xt0rted/dotnet-format-problem-matcher/workflows/CI/badge.svg)](https://github.com/xt0rted/dotnet-format-problem-matcher/actions?query=workflow%3ACI)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=xt0rted/dotnet-format-problem-matcher)](https://dependabot.com)

Adds a problem matcher that will detect errors from [dotnet-format](https://github.com/dotnet/format) and create annotations for them.

## Usage

```yml
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-dotnet@v1
          with:
            dotnet-version: 3.1.101
      - uses: xt0rted/dotnet-format-problem-matcher@v1
      - run: dotnet tool install -g dotnet-format
      - run: dotnet-format --dry-run
```

![Example of inline annotations](docs/annotations.png)

![Example of build log with highlighted errors](docs/build-log.png)

## Options

Name | Allowed values | Description
-- | -- | --
`action` | `add` (default), `remove` | If the problem matcher should be registered or removed

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
