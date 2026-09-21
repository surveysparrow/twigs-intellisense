
// The module 'vscode' contains the VS Code extensibility API

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const packageJson = require('../package.json');

const commands = packageJson.contributes.commands;

const TWIGS_PACKAGE = '@sparrowengg/twigs-react';

/**
 * Look for a package.json in the workspace that depends on Twigs.
 *
 * Every package.json is checked rather than just the workspace root: in a
 * monorepo the dependency is usually declared by a workspace package, not at
 * the top level. Both dependencies and devDependencies count.
 */
async function isTwigsProject() {
  const files = await vscode.workspace.findFiles('**/package.json', '**/node_modules/**');

  for (const file of files) {
    try {
      const contents = await vscode.workspace.fs.readFile(file);
      const pkg = JSON.parse(Buffer.from(contents).toString('utf8'));

      if (pkg.dependencies?.[TWIGS_PACKAGE] || pkg.devDependencies?.[TWIGS_PACKAGE]) {
        return true;
      }
    } catch (err) {
      // Unreadable or malformed package.json — keep looking.
    }
  }

  return false;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {

  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    // No workspace is opened
    return;
  }

  if (!await isTwigsProject()) {
    // The twigs component library is not installed in this workspace.
    return;
  }

  vscode.window.showInformationMessage('Twigs intellisense is now active in your project!');

  commands.forEach(command => {
    const { command: commandName, link } = command;
    const commandDisposable = vscode.commands.registerCommand(commandName, () => {
      vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(link));
    });
    context.subscriptions.push(commandDisposable);
  })
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
  activate,
  deactivate
}
