import * as vscode from 'vscode';
import { execSync } from 'child_process';

export async function searchBible() {
    const searchTerm = await vscode.window.showInputBox({
        placeHolder: 'Enter search term',
        prompt: 'Search the Bible'
    });

    if (!searchTerm) return;

    try {
        const command = `rbible -s "${searchTerm}"`;
        const result = execSync(command).toString();
        
        // Show results in new editor
        const doc = await vscode.workspace.openTextDocument({
            content: result,
            language: 'markdown'
        });
        await vscode.window.showTextDocument(doc);
    } catch (error) {
        vscode.window.showErrorMessage('Error searching Bible');
    }
}