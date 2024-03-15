export function remOrPercentToPx(value: string) {
  // Get the computed font size in pixels
  const fontSize = 16;

  // Check if the value is in REM
  if (typeof value === 'string' && value.endsWith('rem')) {
    const match = value.match(/[\d\.]+/);
    const remNumber = match ? parseFloat(match[0]) : 0;
    return remNumber * fontSize;
  }

  return -1;
}