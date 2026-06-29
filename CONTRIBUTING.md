# Contributing to Twigs IntelliSense

Thanks for your interest in improving Twigs IntelliSense! This guide covers how to set up your
environment, build the project, and submit changes.

## Prerequisites

- **Node.js 22** (the publish workflows run on Node 22; anything 18+ should work for local dev).
- **npm 7+** (this repo uses npm workspaces and a `lockfileVersion: 2` lockfile).
- **VS Code 1.86+** to run and debug the extension.

## Repository layout

This is a monorepo managed with [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces):

| Package | Description |
| --- | --- |
| [`packages/extension`](packages/extension) | The VS Code extension (`twigs-intellisense`). Plain JavaScript; entry point `src/extension.js`. Registers the **Twigs Docs** command-palette links and wires in the language-server plugin. |
| [`packages/plugin`](packages/plugin) | The TypeScript language-server plugin (`twigs-intellisense-plugin`). Written in strict TypeScript, compiled with `tsc` to `out/`. Provides the theme-variable autocomplete and color swatches. |

## Local setup

Install all workspace dependencies from the repo root:

```bash
npm install
```

### Working on the plugin

The plugin is TypeScript and must be compiled. For an iterative loop, run the watch build:

```bash
cd packages/plugin
npm run dev      # tsc -w — recompiles on save
```

(Or `npm run build` for a one-off compile.)

### Working on the extension

Open `packages/extension` in VS Code and press <kbd>F5</kbd>. This launches an **Extension
Development Host** window with the extension loaded. Open a workspace that has
`@sparrowengg/twigs-react` installed and a `twigs.config.{js,ts}` file to exercise the features.

Make sure the plugin has been built first (`npm run build-plugin` from the root), since the
extension depends on the plugin's compiled output.

## Build & package

The root `package.json` defines the orchestration scripts:

| Script | What it does |
| --- | --- |
| `npm run build-plugin` | Compiles the plugin (`packages/plugin` → `out/`). |
| `npm run package:prepare` | Builds the plugin, `npm pack`s it into a `.tgz`, and installs that tarball into the extension (no `package.json` change). |
| `npm run package` | Runs `package:prepare` and then `vsce package` to produce an installable `.vsix`. |

The tarball-install step is what lets the published extension ship the plugin's compiled code.

## Testing & linting

From `packages/extension`:

```bash
npm run lint     # ESLint
npm test         # vscode-test
```

> **Note:** the test suite is currently a placeholder. Improvements to test coverage are very
> welcome and a great first contribution.

## Adding a new "Twigs Docs" command

To add a documentation link to the command palette:

1. Add an entry to the `contributes.commands` array in
   [`packages/extension/package.json`](packages/extension/package.json), following the existing
   pattern:

   ```json
   {
     "command": "extension.twigsDocMyComponent",
     "category": "Twigs Docs",
     "title": "My Component",
     "link": "https://twigs.surveysparrow.com/docs/components/my-component"
   }
   ```

2. Confirm the command is picked up and registered in
   [`packages/extension/src/extension.js`](packages/extension/src/extension.js) (existing commands
   are registered from the `contributes.commands` list — follow how they're wired today).

## Coding conventions

- Match the existing style of each package: **plain JavaScript** in the extension, **strict
  TypeScript** in the plugin.
- Keep pull requests focused on a single change.
- Follow the Conventional-Commit-style prefixes already used in the history (`feat:`, `chore:`,
  `fix:`, `docs:`, …).

## Pull request process

1. Fork the repo and create a branch off `master`.
2. Make your change; ensure `npm run lint` passes.
3. Write a clear PR description and link any related issues.
4. Open the PR against `master`.

## Reporting bugs & requesting features

Open a [GitHub issue](https://github.com/surveysparrow/twigs-intellisense/issues) describing the
problem or proposal. For security vulnerabilities, please use GitHub's
[private vulnerability reporting](https://github.com/surveysparrow/twigs-intellisense/security/advisories/new)
instead of a public issue.

## Release process (maintainers)

1. Bump the `version` in the relevant package's `package.json`
   (`packages/extension` and/or `packages/plugin`) and update its `CHANGELOG.md`.
2. Publish via the GitHub Actions workflows in [`.github/workflows`](.github/workflows):
   - `release.yml` — publishes the extension to both the VS Code Marketplace and Open VSX.
   - `publish-vscode-marketplace.yml` / `publish-open-vsx.yml` — publish to a single registry.
   - `npm-publish.yml` — publishes the `twigs-intellisense-plugin` package to npm (triggered on
     GitHub release creation).

   These workflows rely on the `VSCODE_MARKETPLACE_TOKEN`, `OPEN_VSX_TOKEN`, and `npm_token`
   repository secrets.
