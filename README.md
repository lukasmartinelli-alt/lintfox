# Lintfox [![Build Status](https://travis-ci.org/lukasmartinelli/lintfox.svg)](https://travis-ci.org/lukasmartinelli/lintfox) ![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)

<img align="right" alt="nigit cat logo" src="lintfox.png" />

The goal of **Lintfox** is to encapsulate linters for almost all programming languages, data formats
and configuration files into a single tool you can run on your source code.

## Run Lintfox on your Code

Docker is required to encapsulate all the different linters into one image.
You can run all linters on your code by mounting it to the `/source` volume.

```bash
docker run --rm -v $(pwd):/source lukasmartinelli/lintfox npm run lint
```

## Run a Linter via API Call

You only need to pass the `git_repository` as form value and choose an appropriate linter for your
project to get the output of the linter. If the linter supports JSON formatting you can set the `Accept` header
to `application/json`.

```bash
curl http://localhost8000/scss-lint?git_repository=https://github.com/lukasmartinelli/lintfox.git
```

## Supported Linters

- Ruby
  - rubocop
  - ruby-lint
- Python
  - pep8
  - flake8
  - pyflakes
  - pylint
- GeoJSON
  - geojsonhint
- YAML
  - yamllint

## Developer

Build Docker container.

```bash
docker build -t lukasmartinelli/lintfox src
```
