export function getPropertyNameWithCheck(propertyName: string) {
  // Here we can handle multiple corner cases
  const pN = propertyName.trim().split(' ');
  return pN[pN.length - 1];
}