export function getConfigObject(content: string, regex: RegExp) {
  // Match the regular expression against the file contents
  const match = content.match(regex);

  if (match && match[1]) {
    // Found the variable, parse it to object
    const obj = match[1];
    const config = eval(`(${obj})`);
    
    return config;
  }
  console.error("Object not found in the file. Please check the file contents or regex pattern.");
  return null;
}