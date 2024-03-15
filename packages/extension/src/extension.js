
// The module 'vscode' contains the VS Code extensibility API

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');

const commands = packageJson.contributes.commands;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    // No workspace is opened
    return;
  }

  const packageJsonPath = path.join(workspaceFolders[0].uri.fsPath, 'package.json');

  fs.readFile(packageJsonPath, 'utf8', (err, data) => {
    if (err) {
      // Failed to read package.json
      return;
    }

    const packageJson = JSON.parse(data);

    if (!packageJson.dependencies || !packageJson.dependencies?.['@sparrowengg/twigs-react']) {
      // The twigs component library is not installed in this workspace.
      return;
    }
        
    // Intellisense extension activation code here

    vscode.window.showInformationMessage('Twigs intellisense is now active in your project!');

    commands.forEach(command => {
      const commandName = command.command;
      const link = command.link;
      const commandDisposable = vscode.commands.registerCommand(commandName, () => {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(link));
      });
      context.subscriptions.push(commandDisposable);
    })
  });
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
  activate,
  deactivate
}