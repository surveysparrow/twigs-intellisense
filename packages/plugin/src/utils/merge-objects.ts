export function mergeObjects(obj1: Record<string, any>, obj2: Record<string, any>) {
  const merged = { ...obj1 };

  for (const key in obj2) {
    if (typeof obj2[key] === 'object' && obj2[key] !== null) {
      if (typeof merged[key] === 'object' && merged[key] !== null) {
        merged[key] = mergeObjects(merged[key], obj2[key]);
      } else {
        merged[key] = { ...obj2[key] };
      }
    } else {
      merged[key] = obj2[key];
    }
  }

  return merged;
}