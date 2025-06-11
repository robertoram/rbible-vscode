import * as vscode from 'vscode';
import { execSync } from 'child_process';

export async function showBibleVersions(): Promise<string | undefined> {
    try {
        const output = execSync('rbible -l').toString();
        const versions = output
            .split('\n')
            .filter(line => line.match(/^\s+\w+/))
            .map(line => line.trim());

        return await vscode.window.showQuickPick(versions, {
            placeHolder: 'Select Bible version'
        });
    } catch (error) {
        vscode.window.showErrorMessage('Error getting Bible versions');
        return undefined;
    }
}