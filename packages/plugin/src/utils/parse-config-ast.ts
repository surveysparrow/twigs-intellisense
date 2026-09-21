import ts from 'typescript';

/** Marks a node that cannot be resolved without running code. */
const UNRESOLVED = Symbol('unresolved');

/**
 * Statically resolve a node to a plain JavaScript value.
 *
 * Only literal syntax is understood. Anything else — function calls, variable
 * references, template substitutions — resolves to UNRESOLVED and is dropped by
 * the caller, rather than being executed.
 */
function evaluate(node: ts.Node): any {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);

  switch (node.kind) {
    case ts.SyntaxKind.TrueKeyword: return true;
    case ts.SyntaxKind.FalseKeyword: return false;
    case ts.SyntaxKind.NullKeyword: return null;
  }

  if (ts.isArrayLiteralExpression(node)) {
    const values: any[] = [];
    for (const element of node.elements) {
      const value = evaluate(element);
      // Bail on the whole array: dropping one element would shift the rest.
      if (value === UNRESOLVED) return UNRESOLVED;
      values.push(value);
    }
    return values;
  }

  if (ts.isObjectLiteralExpression(node)) {
    const result: Record<string, any> = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue;

      // Numeric keys matter here: the Twigs space and sizes scales use them.
      const key = property.name;
      if (!ts.isIdentifier(key) && !ts.isStringLiteral(key) && !ts.isNumericLiteral(key)) continue;

      // Skip just this property, so one computed value doesn't lose the rest.
      const value = evaluate(property.initializer);
      if (value === UNRESOLVED) continue;

      result[key.text] = value;
    }
    return result;
  }

  return UNRESOLVED;
}

function toObject(value: any): Record<string, any> | null {
  return value === UNRESOLVED || typeof value !== 'object' || value === null ? null : value;
}

function createSource(filePath: string, contents: string) {
  return ts.createSourceFile(filePath, contents, ts.ScriptTarget.Latest, /* setParentNodes */ false);
}

/** Read the object from `export default { ... }`. */
export function parseDefaultExportObject(filePath: string, contents: string): Record<string, any> | null {
  const source = createSource(filePath, contents);

  for (const statement of source.statements) {
    if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
      return toObject(evaluate(statement.expression));
    }
  }

  return null;
}

/**
 * Read the object assigned to a named variable, e.g. `const defaultTheme = { ... }`.
 * Searches at any depth, since bundled output often nests declarations.
 */
export function parseNamedObject(filePath: string, contents: string, name: string): Record<string, any> | null {
  const source = createSource(filePath, contents);
  let initializer: ts.Expression | null = null;

  const visit = (node: ts.Node) => {
    if (initializer) return;
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === name && node.initializer) {
      initializer = node.initializer;
      return;
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(source, visit);

  return initializer ? toObject(evaluate(initializer)) : null;
}
