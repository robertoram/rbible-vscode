import * as vscode from 'vscode';
import { exec, execSync } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function activate(context: vscode.ExtensionContext) {
    // Add command to install rbible
    let installRBible = vscode.commands.registerCommand('rbible-vscode.installRBible', async () => {
        try {
            const pythonPath = vscode.workspace.getConfiguration('rbible').get('pythonPath', 'python3');
            const terminal = vscode.window.createTerminal('RBible Install');
            terminal.sendText(`${pythonPath} -m pip install rbible`);
            terminal.show();
            vscode.window.showInformationMessage('Installing rbible...');
        } catch (error) {
            vscode.window.showErrorMessage('Failed to install rbible');
        }
    });

    // Comando para buscar versículo
    let lookupVerse = vscode.commands.registerCommand('rbible-vscode.lookupVerse', async () => {
        const verse = await vscode.window.showInputBox({
            placeHolder: 'Enter verse reference (e.g., Juan 3:16)',
            prompt: 'Look up Bible verse'
        });

        if (verse) {
            try {
                const useMarkdown = vscode.workspace.getConfiguration('rbible').get('useMarkdownFormat', false);
                const defaultVersion = vscode.workspace.getConfiguration('rbible').get('defaultVersion', 'RVR1960');
                
                // Add -m flag if markdown is enabled
                const markdownFlag = useMarkdown ? '-m' : '';

                // Obtener versiones disponibles
                const output = execSync('rbible -l').toString();
                const versions = output
                    .split('\n')
                    .filter(line => line.match(/^\s+\w+/))
                    .map(line => line.trim());

                // Mostrar selector de versión
                const selectedVersion = await vscode.window.showQuickPick(versions, {
                    placeHolder: 'Select Bible version'
                });

                if (selectedVersion) {
                    const result = execSync(`rbible -v "${verse}" -b ${selectedVersion} ${markdownFlag}`).toString();
                    const panel = vscode.window.createWebviewPanel(
                        'rbibleVerse',
                        `RBible: ${verse} (${selectedVersion})`,
                        vscode.ViewColumn.Two,
                        { enableScripts: true }
                    );
                    panel.webview.html = getWebviewContent(result);
                }
            } catch (error) {
                vscode.window.showErrorMessage('Error looking up verse: ' + error);
            }
        }
    });

    // Comando para versos en paralelo
    let parallelVerses = vscode.commands.registerCommand('rbible-vscode.parallelVerses', async () => {
        // Pedir al usuario la referencia del versículo
        const verse = await vscode.window.showInputBox({
            placeHolder: 'Enter bible reference (e.g. Juan 3:16)',
            prompt: 'Enter a bible verse reference'
        });

        if (!verse) {
            return;
        }

        try {
            // Obtener versiones disponibles
            const output = execSync('rbible -l').toString();
            const versions = output
                .split('\n')
                .filter(line => line.match(/^\s+\w+/))
                .map(line => line.trim());

            // Crear los QuickPickItems con checkboxes
            const items = versions.map(version => ({
                label: version,
                picked: ['LBLA', 'RVR'].includes(version) // preseleccionar LBLA y RVR
            }));

            // Mostrar selector múltiple
            const selectedVersions = await vscode.window.showQuickPick(items, {
                placeHolder: 'Select Bible versions (use space to select/unselect)',
                canPickMany: true
            });

            if (!selectedVersions || selectedVersions.length === 0) {
                return;
            }

            // Convertir selecciones a string de versiones separadas por coma
            const versionsString = selectedVersions.map(item => item.label).join(',');

            // Ejecutar el comando rbible con los parámetros correctos
            const result = execSync(`rbible -v "${verse}" -p "${versionsString}" -m`).toString();
            
            // Crear y mostrar el panel
            const panel = vscode.window.createWebviewPanel(
                'bibleParallel',
                `Parallel: ${verse}`,
                vscode.ViewColumn.Two,
                {}
            );

            // Mostrar el resultado en el panel
            panel.webview.html = getWebviewContent(result);

        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error: ${error.message}`);
            } else {
                vscode.window.showErrorMessage(`Error: ${String(error)}`);
            }
        }
    });

    // Comando para búsqueda en la Biblia
    let searchBible = vscode.commands.registerCommand('rbible-vscode.searchBible', async () => {
        const searchTerm = await vscode.window.showInputBox({
            placeHolder: 'Enter search term',
            prompt: 'Search the Bible'
        });

        if (searchTerm) {
            try {
                const result = execSync(`rbible -s "${searchTerm}" -m`).toString();
                const panel = vscode.window.createWebviewPanel(
                    'rbibleSearch',
                    `RBible Search: ${searchTerm}`,
                    vscode.ViewColumn.Two,
                    { enableScripts: true }
                );
                panel.webview.html = getWebviewContent(result);
            } catch (error) {
                vscode.window.showErrorMessage('Error searching Bible: ' + error);
            }
        }
    });

    context.subscriptions.push(installRBible, lookupVerse, parallelVerses, searchBible);
}

function getWebviewContent(content: string) {
    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { 
                    padding: 15px;
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                }
                pre { 
                    white-space: pre-wrap;
                    font-family: inherit;
                }
            </style>
        </head>
        <body>
            <pre>${content}</pre>
        </body>
    </html>`;
}

export function deactivate() {}