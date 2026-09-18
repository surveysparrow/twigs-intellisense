# twigs-intellisense-plugin

[![npm version](https://img.shields.io/npm/v/twigs-intellisense-plugin?color=blue)](https://www.npmjs.com/package/twigs-intellisense-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

A [TypeScript language service plugin](https://www.typescriptlang.org/tsconfig/#plugins) that adds
autocomplete for [**Twigs**](https://twigs.surveysparrow.com) theme tokens — colors, spacing,
typography, radii and the rest — wherever you write Twigs styles.

> **Using VS Code?** Install the
> [**Twigs IntelliSense extension**](https://marketplace.visualstudio.com/items?itemName=SurveySparrow.twigs-intellisense)
> instead. It bundles this plugin and wires it up for you — no tsconfig changes needed.
>
> This package is for editors that load TypeScript plugins directly (Neovim, Sublime, WebStorm's
> TS service, or a hand-configured `tsconfig.json`).

## What it does

When you type inside a `css` prop or style object, the plugin rewrites the TypeScript completion
list so that Twigs tokens show their **resolved value** instead of an opaque name:

```jsx
<Box css={{ padding: '$|' }} />
//                     ↑ 16px (1rem), 24px (1.5rem), 32px (2rem), …

<Box css={{ color: '$|' }} />
//                   ↑ #2E2E2E, #0B7ACB, … each with a color swatch
```

- **Resolved values** on every token suggestion.
- **Pixel equivalents** for `rem` and `%` values — `16px (1rem)` rather than a bare `1rem`.
- **Color swatches** next to `colors` tokens.
- **Your custom tokens**, picked up from `theme.extends` in your Twigs config.
- **Live reload** — edit `twigs.config.{js,ts}` and completions update without restarting the editor.

## Installation

```sh
npm install --save-dev twigs-intellisense-plugin
```

Register it in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "twigs-intellisense-plugin" }]
  }
}
```

Then restart your editor's TypeScript server.

### If completions don't appear in VS Code

Plugins declared in `tsconfig.json` only load when VS Code uses your **workspace** TypeScript
version, not its own bundled copy. Open the command palette, run
**TypeScript: Select TypeScript Version**, and choose **Use Workspace Version**.

(The [extension](https://marketplace.visualstudio.com/items?itemName=SurveySparrow.twigs-intellisense)
sidesteps this entirely — it registers the plugin through VS Code's
`typescriptServerPlugins` contribution point.)

## How your theme is resolved

The plugin builds the token list from two files, merged in this order:

1. **The Twigs default theme** — read from
   `node_modules/@sparrowengg/twigs-react/dist/es/stitches.config.js` in your project root.
2. **Your overrides** — `theme.extends` from `twigs.config.js`, or `twigs.config.ts` if no `.js`
   config exists. Values here win over the defaults.

"Project root" is found by walking up from the current directory until a `node_modules` folder
appears, so the plugin works from inside a monorepo package.

Both files are read **statically** — the plugin parses them with the TypeScript compiler and
reads literal values. It never executes your config.

## Supported tokens

| Token group | Completes on CSS properties like |
| --- | --- |
| `colors` | `color`, `background`, `backgroundColor`, `borderColor`, `fill`, `stroke`, `outlineColor`, … |
| `space` | `padding`, `margin`, `gap`, `inset`, … |
| `sizes` | `width`, `height`, `minWidth`, `maxHeight`, … |
| `radii` | `borderRadius` and its per-corner variants |
| `borderStyles` | `borderStyle`, `borderWidth` and their per-side variants |
| `fontSizes` | `fontSize` |
| `fonts` | `fontFamily` |
| `fontWeights` | `fontWeight` |
| `lineHeights` | `lineHeight` |
| `letterSpacings` | `letterSpacing` |
| `shadows` | `boxShadow` |
| `transitions` | `transitionDuration` |
| `zIndices` | `zIndex` |

## Troubleshooting

- **No suggestions at all** — confirm `@sparrowengg/twigs-react` is installed in the project root,
  and that your editor is using the workspace TypeScript version (see above).
- **Custom tokens missing** — they must live under `theme.extends` in your Twigs config. See the
  [Twigs theming docs](https://twigs.surveysparrow.com/docs/theming/#customize-theme).
- **Computed values missing** — the config is parsed, not executed, so tokens produced by function
  calls or imported variables can't be read. Use literal values.
- **Config file not picked up** — it must be named `twigs.config.js` or `twigs.config.ts` and sit in
  the project root. A `.js` config takes precedence when both exist.

## Contributing

This package lives in the
[twigs-intellisense monorepo](https://github.com/surveysparrow/twigs-intellisense). See
[CONTRIBUTING.md](https://github.com/surveysparrow/twigs-intellisense/blob/master/CONTRIBUTING.md)
for local setup, and [CHANGELOG.md](./CHANGELOG.md) for release notes.

## License

[MIT](./LICENSE) © SurveySparrow
