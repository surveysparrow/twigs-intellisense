# Changelog

All notable changes to `twigs-intellisense-plugin` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - Unreleased

### Security

- **Twigs config files are no longer executed.** `twigs.config.{js,ts}` and the
  Twigs `stitches.config.js` were previously read by matching a regex and passing
  the result to `eval()`. Opening a project with a crafted config ran arbitrary
  code inside the TypeScript server process. Both files are now parsed with the
  TypeScript compiler and read as literal values only.

### Fixed

- Compile target pinned to `ES2022` instead of `ESNext`, so emitted syntax stays
  within what the Node version bundled with VS Code can parse. `ESNext` tracks
  whatever the installed TypeScript supports, which could silently raise the
  runtime requirement. Current output is unchanged.
- `npm run build` now clears `out/` first. Compiled files whose sources had been
  deleted were lingering in the directory and being published.
- A malformed or partially-saved config no longer throws. Reload failures inside
  the config file watcher are caught and logged instead of crashing the
  TypeScript server process.
- `getMainConfig` returns `null` instead of `-1` when the Twigs theme cannot be
  read, so the caller's guard actually stops initialization rather than letting a
  truthy sentinel through.

### Changed

- Completion detail text no longer repeats the CSS property name. Values are now
  shown on their own, with the pixel equivalent first for `rem`/`%` tokens —
  `16px (1rem)` instead of `padding: 1rem /* 16px */`.

## [0.0.2] - 2024-03-18

### Fixed

- Point `main` at `./out/index.js` instead of the `./out` directory, so the
  TypeScript server can resolve the plugin entry point.
- Add a `files` allowlist to the manifest so the compiled `out/` directory is
  actually included in the published package.

## [0.0.1] - 2024-03-17

### Added

- Initial release: a TypeScript language service plugin that adds Twigs theme
  token IntelliSense to `css` prop and style object completions.
- Resolve the merged theme from the Twigs `stitches.config.js` and the project's
  `twigs.config.js` / `twigs.config.ts`, searching upward for the workspace root
  so the plugin works inside monorepo packages.
- Annotate completion entries with their resolved token value, including the
  pixel equivalent for `rem` and `%` values in `space`, `radii`, `fontSizes`,
  and `lineHeights`.
- Render color swatches alongside `colors` token completions.
- Surface tokens added through `theme.extends` in the completion list.
- Watch the Twigs config file and refresh the theme on change, without a restart.

[0.0.3]: https://github.com/surveysparrow/twigs-intellisense/compare/twigs-intellisense-plugin@0.0.2...HEAD
[0.0.2]: https://github.com/surveysparrow/twigs-intellisense/compare/twigs-intellisense-plugin@0.0.1...twigs-intellisense-plugin@0.0.2
[0.0.1]: https://github.com/surveysparrow/twigs-intellisense/releases/tag/twigs-intellisense-plugin@0.0.1
