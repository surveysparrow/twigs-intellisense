# Twigs IntelliSense

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/SurveySparrow.twigs-intellisense?label=VS%20Marketplace&color=blue)](https://marketplace.visualstudio.com/items?itemName=SurveySparrow.twigs-intellisense)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/SurveySparrow.twigs-intellisense?color=blue)](https://marketplace.visualstudio.com/items?itemName=SurveySparrow.twigs-intellisense)
[![Open VSX Version](https://img.shields.io/open-vsx/v/SurveySparrow/twigs-intellisense?label=Open%20VSX&color=purple)](https://open-vsx.org/extension/SurveySparrow/twigs-intellisense)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A Visual Studio Code extension that enhances the developer experience for
[**Twigs**](https://twigs.surveysparrow.com) — SurveySparrow's open-source React component
library. It adds autocomplete for theme variables, inline color previews, and quick access to
Twigs component documentation from the command palette.

## What's in this repository

This is a monorepo ([npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)) with two
packages that work together:

| Package | Published as | What it does |
| --- | --- | --- |
| [`packages/extension`](packages/extension) | [`twigs-intellisense`](https://marketplace.visualstudio.com/items?itemName=SurveySparrow.twigs-intellisense) (VS Code extension) | Activates in Twigs projects, registers the **Twigs Docs** command-palette links, and bundles the language-server plugin below. |
| [`packages/plugin`](packages/plugin) | [`twigs-intellisense-plugin`](https://www.npmjs.com/package/twigs-intellisense-plugin) (TypeScript LS plugin) | Hooks into the TypeScript language service to autocomplete Twigs theme variables (colors, spacing, typography, …), watches `twigs.config.{js,ts}` for live changes, and renders color swatches in completions. |

## Features

### Autocomplete

Intelligent suggestions with resolved values for Twigs theme variables.

<img src="https://static.surveysparrow.com/site/twigs/autocomplete.png" alt="Twigs IntelliSense autocomplete" />

### Quick access to Twigs docs

Open the command palette (`Ctrl/Cmd + Shift + P`), search for **Twigs Docs**, and jump straight to
any component's documentation.

<img src="https://static.surveysparrow.com/site/twigs/twigs-ui-docs.png" alt="Twigs Docs command palette" />

### Color preview

See a color swatch next to color-variable suggestions.

<img src="https://static.surveysparrow.com/site/twigs/color-swatch.png" alt="Color swatch in suggestions" />

## Installation

- **[Visual Studio Code Marketplace →](https://marketplace.visualstudio.com/items?itemName=SurveySparrow.twigs-intellisense)**
- **[Open VSX Registry →](https://open-vsx.org/extension/SurveySparrow/twigs-intellisense)**

For the extension to activate, your workspace must:

1. Have [`@sparrowengg/twigs-react` installed](https://twigs.surveysparrow.com/docs/getting-started), and
2. Contain a [Twigs config file](https://twigs.surveysparrow.com/docs/theming/#customize-theme) named
   `twigs.config.{js,ts}` in the workspace root.

## Development quick-start

```bash
git clone https://github.com/surveysparrow/twigs-intellisense.git
cd twigs-intellisense
npm install
npm run build-plugin   # compile the TypeScript language-server plugin
```

Then open `packages/extension` in VS Code and press <kbd>F5</kbd> to launch the Extension
Development Host. To produce an installable `.vsix`:

```bash
npm run package
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full development, build, and release workflow.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for how to set up your
environment, the repository layout, and the pull-request process.

## Security

Please report security vulnerabilities through GitHub's
[private vulnerability reporting](https://github.com/surveysparrow/twigs-intellisense/security/advisories/new)
rather than opening a public issue.

## License

[MIT](LICENSE) © SurveySparrow
