import * as vscode from 'vscode';
import { execSync } from 'child_process';

export async function showParallelVerses() {
    // Get verse reference
    const reference = await vscode.window.showInputBox({
        placeHolder: 'Enter Bible verse (e.g. John 3:16)',
        prompt: 'Enter the verse reference to view in parallel'
    });

    if (!reference) return;

    // Get versions list
    const output = execSync('rbible -l').toString();
    const versions = output
        .split('\n')
        .filter(line => line.match(/^\s+\w+/))
        .map(line => line.trim());

    // Let user select multiple versions
    const selectedVersions = await vscode.window.showQuickPick(versions, {
        canPickMany: true,
        placeHolder: 'Select Bible versions for parallel view'
    });

    if (!selectedVersions || selectedVersions.length === 0) return;

    try {
        const command = `rbible "${reference}" -b ${selectedVersions.join(',')}`;
        const result = execSync(command).toString();
        
        // Show results in new editor
        const doc = await vscode.workspace.openTextDocument({
            content: result,
            language: 'markdown'
        });
        await vscode.window.showTextDocument(doc);
    } catch (error) {
        vscode.window.showErrorMessage('Error showing parallel verses');
    }
}