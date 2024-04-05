# Twigs Intellisense

Twigs IntelliSense enhances the Twigs development experience by providing Visual Studio Code users with advanced features such as autocomplete, easy access to the Twigs components documentation from VSCode command palette and color swatch reference for color variables.

## Installation

**[Install via the Visual Studio Code Marketplace →](https://marketplace.visualstudio.com/items?itemName=SurveySparrow.twigs-intellisense)**

In order for the extension to activate you must have [`Twigs` installed](https://twigs.surveysparrow.com/docs/getting-started) and a [Twigs config file](https://twigs.surveysparrow.com/docs/theming/#customize-theme) named `twigs.config.{js,ts}` in your workspace root directory.

## Features

### Autocomplete

Intelligent suggestions with values for Twigs theme variables.

<img src="https://static.surveysparrow.com/site/twigs/autocomplete.png" alt="intellisense-png" />

### Quick Access to Twigs Docs

Easy access to Twigs docs from VSCode command palette.

<img src="https://static.surveysparrow.com/site/twigs/twigs-ui-docs.png" alt="twigs-ui-docs-png" />

Press (Ctrl + Shift + P) in windows or (Cmd + Shift + P) in mac to open Command Palette. Search for Twigs Docs to list all the components. Select the item to redirect to Twigs Documentation.

### Color Preview

See the color preview on the suggestions.

<img src="https://static.surveysparrow.com/site/twigs/color-swatch.png" alt="color-swatch" />

## Troubleshooting

If you’re having issues getting the IntelliSense features to activate, there are a few things you can check:

- Reload VSCode. To reload Press (Ctrl + Shift + P) in windows or (Cmd + Shift + P). Select Reload Window.
- Ensure that you have a Twigs config file in your workspace and that this is named `twigs.config.{js,ts}`. Check out the Twigs documentation for details on [creating a config file](https://twigs.surveysparrow.com/docs/theming/#customize-theme).
- Ensure that the `Twigs` module is installed in your workspace, via `npm`, `yarn`.
- Make sure your VS Code settings aren’t causing your Twigs config file to be hidden/ignored, for example via the `files.exclude` or `files.watcherExclude` settings.
