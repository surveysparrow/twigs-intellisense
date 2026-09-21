# Changelog

All notable changes to the **Twigs IntelliSense** extension are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2026-09-21

### Security

- The bundled language-service plugin no longer executes your Twigs config.
  `twigs.config.{js,ts}` was previously read with `eval()`, so opening a project
  with a crafted config ran arbitrary code inside the TypeScript server. Configs
  are now parsed statically and read as literal values only. See the
  [plugin changelog](../plugin/CHANGELOG.md) for details.

### Fixed

- A malformed or partially-saved Twigs config no longer crashes the TypeScript
  server; completions fall back to the previously loaded theme.

## [0.0.2] - 2025-09-26

### Added

- 11 more components in the **Twigs Docs** command palette list, including
  Editor, Icon Button, Image, Line Loader, Link, Radio and Separator.

### Changed

- Completion details show the token value on its own instead of repeating the
  CSS property name, with the pixel equivalent first for `rem` and `%` tokens —
  `16px (1rem)` rather than `padding: 1rem /* 16px */`.

### Fixed

- Corrected the packaging configuration so the bundled language-service plugin
  is included in the published extension.

## [0.0.1] - 2024-04-08

### Added

- Initial release.
- Autocomplete for Twigs theme tokens — colors, spacing, typography, radii and
  more — with resolved values shown in the completion list.
- Color swatches next to color token suggestions.
- **Twigs Docs** command palette entries linking to each component's
  documentation.
