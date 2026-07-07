# Task Completion

- For docs or skill changes:
  - Review Markdown rendering-sensitive structure manually.
  - Run `git diff --check` to catch whitespace issues.
  - Run `git status --short` to report changed files.
- For Python example/script additions:
  - Run the narrow script or syntax check if credentials/network are not required.
  - If live GRVT endpoints are required, state that verification depends on configured credentials and chosen `GRVT_ENV`.
- For memory changes:
  - Ask the user or run `serena memories check` from the project root when they want validation.
- There is currently no repo-defined formatter, linter, type checker, test runner, or build command.