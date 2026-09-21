import ts from "typescript";
import path from 'path';
import fs from 'fs';

import {
  getThemeProperty,
  getPropertyName,
  getTwigsConfig,
  getMainConfig,
  getModifiedPriorEntries,
  getThemeObject,
  getDisplayText,
} from './helpers';
import { themeConstants } from "./constants";
import { findRootDir } from "./utils/find-root-directory";

function init(modules: { typescript: typeof import("typescript/lib/tsserverlibrary") }) {

  function create(info: ts.server.PluginCreateInfo) {
    // Diagnostic logging
    info.project.projectService.logger.info(
      "I'm getting set up now! Check the log for this message."
    );

    // Set up decorator object
    const proxy: ts.LanguageService = Object.create(null);
    for (let k of Object.keys(info.languageService) as Array<keyof ts.LanguageService>) {
      const x = info.languageService[k]!;
      // @ts-ignore
      proxy[k] = (...args: Array<{}>) => x.apply(info.languageService, args);
    }

    // Get the current project directory
    const currDir = info.project.getCurrentDirectory();

    if (!currDir) {
      // No Directory found
      return;
    }

    // Get the root directory
    const rootDir = findRootDir(currDir);

    const projectDir = rootDir ?? currDir;

    // Get the main config path
    const mainConfigPath = path.join(
      projectDir,
      'node_modules',
      '@sparrowengg',
      'twigs-react',
      'dist',
      'es',
      'stitches.config.js'
    );

    // Get the twigs js config path
    const twigsConfigPathJs = path.join(
      projectDir,
      'twigs.config.js'
    );

    // Get the twigs ts config path
    const twigsConfigPathTs = path.join(
      projectDir,
      'twigs.config.ts'
    );

    // Initially let the config path be twigsConfigPathTs
    let twigsConfigPath = twigsConfigPathTs;

    // But if twigs.config.js file exists then pick it from there
    if (fs.existsSync(twigsConfigPathJs)) {
      twigsConfigPath = twigsConfigPathJs;
    }

    let twigsConfig = getTwigsConfig(twigsConfigPath);
    const mainConfig = getMainConfig(mainConfigPath);

    if (!mainConfig) return;

    // Get the merged theme object
    let themeObj = getThemeObject(twigsConfig, mainConfig);

    if (!themeObj) return;

    // Watch the twigs config file for changes and update the twigsConfig object
    const twigsConfigDir = path.dirname(twigsConfigPath);

    // Watch the directory for changes
    fs.watch(twigsConfigDir, (eventType, filename) => {
      // Anything thrown here is an uncaught exception in an async callback,
      // which would take down the whole TypeScript server process. Keep the
      // stale theme instead and log it.
      try {
        // If a file was added or changed and the file is twigsConfigPath
        if ((eventType === 'rename' || eventType === 'change') && (filename === path.basename(twigsConfigPathJs) || filename === path.basename(twigsConfigPathTs))) {
          // Initially let the config path be twigsConfigPathTs
          let configPathToPick = twigsConfigPathTs;
          // But if twigs.config.js file exists then pick it from there
          if (fs.existsSync(twigsConfigPathJs)) {
            configPathToPick = twigsConfigPathJs;
          }

          // If the file exists
          if (fs.existsSync(configPathToPick)) {
            // Update the twigsConfig object
            twigsConfig = getTwigsConfig(configPathToPick);
            themeObj = getThemeObject(twigsConfig, mainConfig);
          } else {
            twigsConfig = null;
            themeObj = getThemeObject(null, mainConfig);
          }
        }
      } catch (err) {
        info.project.projectService.logger.info(`twigs-intellisense: failed to reload twigs config: ${err}`);
      }
    });

    // Modify specified entries from completion list
    proxy.getCompletionsAtPosition = (fileName, position, options) => {
      const prior = info.languageService.getCompletionsAtPosition(fileName, position, options);
      if (!prior) return;

      // Get the file contents
      const scriptSnapshot = info.languageServiceHost.getScriptSnapshot(fileName);
      const fileCnts = scriptSnapshot?.getText(0, scriptSnapshot.getLength());

      if (!fileCnts) return prior;

      // Get the text until the cursor position
      const textUntilCursor = fileCnts.substring(0, position);

      // Get the last index of comma or open brace to determine if its a css property
      const lastCommaIndex = textUntilCursor.lastIndexOf(',');
      const lastOpenBraceIndex = textUntilCursor.lastIndexOf('{');

      // Get the last index of comma or open brace
      const lastIndex = Math.max(lastCommaIndex, lastOpenBraceIndex);

      // Get the text from the last index to the cursor position
      const textFromLastSymbol = textUntilCursor.substring(lastIndex + 1);
      const isCssProperty = textFromLastSymbol.includes(':');

      if (!isCssProperty) return prior;

      // Get the property name
      const propertyNameSplit = textFromLastSymbol.trim().split(':');
      const propertyName = getPropertyName(propertyNameSplit);
      const themeProperty = getThemeProperty(propertyName);

      // If the property name is not found in the theme object, avoid modifying the completion list
      if (!themeProperty) return prior;

      // Get property object data from theme object to modify the completion list item
      let propertyObj = themeObj[themeProperty];

      const currentExtendedPropertyNames = Object.keys(twigsConfig?.theme?.extends?.[themeProperty] || {})

      const extendedTheme = twigsConfig?.theme?.extends || {};

      const extendedProperties = {
        extendedTheme,
        currentExtendedPropertyNames
      };

      // Modify the completion list
      prior.entries = getModifiedPriorEntries(prior.entries, propertyObj, themeProperty, extendedProperties);

      // Add the extended properties to the completion list if they exist
      if (twigsConfig && typeof twigsConfig == 'object') {
        currentExtendedPropertyNames.forEach((name, ind) => {
          // Construct entry item here and push
          const value = extendedTheme?.[themeProperty]?.[name];
          prior.entries.push({
            name: '$' + name, 
            kind: ts.ScriptElementKind.string, 
            kindModifiers: themeProperty === themeConstants.colors ? 'color' : '',
            sortText: ind.toString().padStart(3, '0'),
            sourceDisplay: [{
              kind: 'text',
              text:  getDisplayText(themeProperty, value)
            }]
          })
        })
      }

      proxy.getCompletionEntryDetails = (fileName: any, position: any, entryName: any, formatOptions: any, source: any, preferences: any, data: any) => {
        const details = info.languageService.getCompletionEntryDetails(fileName, position, entryName, formatOptions, source, preferences, data);
      
        if (details) {
          if (themeProperty === themeConstants.colors) {
            const name = entryName.replace('$', '')
            const value = themeObj[themeConstants.colors][name];
            details.documentation = [{
              kind: 'markdown',
              text: `![color](https://via.placeholder.com/15/${value.substring(1)}/000000?text=+) ${value}`
            }];
          }
        }
        return details;
      };

      return prior;
    };

    return proxy;
  }

  return { create };
}

export = init;