import { CompletionEntry } from 'typescript';
import { colorProperties, space, borderSizing, radii, sizes, borderStyle, themeConstants } from '../constants';
import { getConfigObject, getPropertyNameWithCheck, mergeObjects, parseFile, remOrPercentToPx } from '../utils';
import { otherCssPropertiesConstants } from '../constants/theme-constants';

// Helpers
function getThemeProperty(propertyName: string) {
  let property = propertyName;

  if (colorProperties.includes(propertyName)) return themeConstants.colors;

  if (space.includes(propertyName)) return themeConstants.space;

  if (borderSizing.includes(propertyName)) return themeConstants.borderStyles;

  if (radii.includes(propertyName)) return themeConstants.radii;

  if (sizes.includes(propertyName)) return themeConstants.sizes;

  if (borderStyle.includes(propertyName)) return themeConstants.borderStyles;

  switch (property) {
    case otherCssPropertiesConstants.fontSize:
      property = themeConstants.fontSizes
      break;
    case otherCssPropertiesConstants.fontFamily:
      property = themeConstants.fonts
      break;
    case otherCssPropertiesConstants.fontWeight:
      property = themeConstants.fontWeights
      break;
    case otherCssPropertiesConstants.lineHeight:
      property = themeConstants.lineHeights
      break;
    case otherCssPropertiesConstants.boxShadow:
      property = themeConstants.shadows
      break;
    case otherCssPropertiesConstants.transitionDuration:
      property = themeConstants.transitions
      break;
    case otherCssPropertiesConstants.zIndex:
      property = themeConstants.zIndices
      break;
    case otherCssPropertiesConstants.letterSpacing:
      property = themeConstants.letterSpacings
      break;
    default:
      property = ''
      break;
  }
  return property;
}

function getPropertyName(pnS: string[]) {
  const colSep = pnS; // colonSeparated split
  // Taking the second last, As the current position will always be the last index and the property name will be the second last index
  const SECOND_LAST_INDEX = 2;
  const propertyName = colSep[colSep.length - SECOND_LAST_INDEX] || colSep[0]; // property name with basic check
  const propertyNameWithCheck = getPropertyNameWithCheck(propertyName);
  return propertyNameWithCheck;
}

function getTwigsConfig(configPath: string) {
  const twigsConfigContents = parseFile(configPath);
  if (!twigsConfigContents) return null;

  const regex = /export\s*default\s*({[\s\S]*})[;}]?/;
  const configObj = getConfigObject(twigsConfigContents, regex);
  return configObj;
}

function getMainConfig(configPath: string) {
  const mainConfigContents = parseFile(configPath);
  if (!mainConfigContents) return -1;

  const regex = /const\s*defaultTheme\s*=\s*(\{[\s\S]+?\});/;
  const configObj = getConfigObject(mainConfigContents, regex);
  return configObj;
}

function getDisplayText(themeProperty: string, value: string, propertyName: string) {
  const { space, radii, fontSizes, lineHeights } = themeConstants
  let text = '';

  if (typeof value === 'string' || typeof value === 'number') {
    if ([space, radii, fontSizes, lineHeights].includes(themeProperty)) {
      const pxValue = remOrPercentToPx(value);
      text = `${propertyName}: ${value} ${pxValue !== -1 ? `/* ${pxValue}px */` : ''}`;
    } else {
      text = `${propertyName}: ${value}`;
    }
  }

  return text;
}

function getModifiedPriorEntries(entries: CompletionEntry[], themeObj: Record<string, any>, themeProperty: string, propertyName: string, extendedProperties: Record<any, any>) {
  return entries.map((entry, ind) => {
    const name = entry.name.replace('$', '');
    // Get the extended properties
    const { extendedTheme, currentExtendedPropertyNames } = extendedProperties;

    // Overriding the value if it exists in the twigs extend object
    let value;
    if (currentExtendedPropertyNames.includes(name)) {
      value = extendedTheme?.[themeProperty]?.[name];
      // Remove the property from the currentExtendedPropertyNames array
      let index = currentExtendedPropertyNames.indexOf(name);
      if (index !== -1) currentExtendedPropertyNames.splice(index, 1);

    } else {
      value = themeObj[name]
    };

    if (value) {
      const text = getDisplayText(themeProperty, value, propertyName)
      // Modify the source display to show the value
      if (themeProperty === themeConstants.colors) {
        entry.kindModifiers = 'color'
      };
      entry.sourceDisplay = [{
        kind: 'text',
        text: text,
      }];
      // Add a sort text to sort the entries properly
      entry.sortText = (entry.name.startsWith('$') ? ' ' : '') + ind.toString().padStart(3, '0');
      return entry;

    } else {
      // Return the original entry's name for the source display
      entry.sourceDisplay = [{
        kind: 'text',
        text: name,
      }];
    }

    return entry;
  });
}

function getThemeObject(twigsConfig: Record<string, any> | null, mainConfig: Record<string, any>) {
  if (twigsConfig && typeof twigsConfig == 'object') {
    return mergeObjects(mainConfig, twigsConfig.theme?.extends);
  } 
  return mainConfig;
}

export {
  getThemeProperty,
  getPropertyName,
  getTwigsConfig,
  getMainConfig,
  getModifiedPriorEntries,
  getThemeObject,
  getDisplayText,
}