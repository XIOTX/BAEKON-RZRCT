import * as vscode from 'vscode';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';

interface VaultDocument {
  id: string;
  title: string;
  content: string;
  path: string;
  category: string;
  lastModified: string;
  tags: string[];
  links: string[];
}

interface LexiconEntry {
  surface_form: string;
  gloss: string;
  confidence: number;
  source_id: string;
}

class BaekonResearchProvider implements vscode.TreeDataProvider<ResearchItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<ResearchItem | undefined | null | void> = new vscode.EventEmitter<ResearchItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<ResearchItem | undefined | null | void> = this._onDidChangeTreeData.event;

  private apiUrl: string;
  private vaultPath: string;

  constructor() {
    const config = vscode.workspace.getConfiguration('baekon');
    this.apiUrl = config.get('apiUrl', 'http://127.0.0.1:8787');
    this.vaultPath = config.get('vaultPath', '../BAEKON-Research-Vault');
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ResearchItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: ResearchItem): Promise<ResearchItem[]> {
    if (!element) {
      // Root level
      return [
        new ResearchItem('FL Documents', vscode.TreeItemCollapsibleState.Collapsed, 'category', 'documents'),
        new ResearchItem('Lexicon', vscode.TreeItemCollapsibleState.Collapsed, 'category', 'lexicon'),
        new ResearchItem('Analysis Tools', vscode.TreeItemCollapsibleState.Collapsed, 'category', 'tools'),
        new ResearchItem('Research Vault', vscode.TreeItemCollapsibleState.Collapsed, 'category', 'vault')
      ];
    }

    switch (element.contextValue) {
      case 'documents':
        return this.getDocuments();
      case 'lexicon':
        return this.getLexiconEntries();
      case 'tools':
        return this.getAnalysisTools();
      case 'vault':
        return this.getVaultDocuments();
      default:
        return [];
    }
  }

  private async getDocuments(): Promise<ResearchItem[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/anas-index/search?q=&limit=10`);
      return response.data.map((doc: any) => 
        new ResearchItem(
          doc.title || 'Untitled',
          vscode.TreeItemCollapsibleState.None,
          'document',
          doc.id
        )
      );
    } catch (error) {
      return [new ResearchItem('Error loading documents', vscode.TreeItemCollapsibleState.None, 'error')];
    }
  }

  private async getLexiconEntries(): Promise<ResearchItem[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/lexicon/search?q=`);
      return response.data.slice(0, 10).map((entry: LexiconEntry) => 
        new ResearchItem(
          `${entry.surface_form} → ${entry.gloss}`,
          vscode.TreeItemCollapsibleState.None,
          'lexicon-entry',
          entry.surface_form
        )
      );
    } catch (error) {
      return [new ResearchItem('Error loading lexicon', vscode.TreeItemCollapsibleState.None, 'error')];
    }
  }

  private getAnalysisTools(): ResearchItem[] {
    return [
      new ResearchItem('Translate FL Text', vscode.TreeItemCollapsibleState.None, 'tool', 'translate'),
      new ResearchItem('Search Ana\'s Index', vscode.TreeItemCollapsibleState.None, 'tool', 'search'),
      new ResearchItem('Lexicon Lookup', vscode.TreeItemCollapsibleState.None, 'tool', 'lexicon-search')
    ];
  }

  private async getVaultDocuments(): Promise<ResearchItem[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/vault/search?q=`);
      return response.data.results.slice(0, 10).map((doc: VaultDocument) => 
        new ResearchItem(
          doc.title,
          vscode.TreeItemCollapsibleState.None,
          'vault-document',
          doc.id
        )
      );
    } catch (error) {
      return [new ResearchItem('Error loading vault', vscode.TreeItemCollapsibleState.None, 'error')];
    }
  }
}

class ResearchItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly id?: string
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    this.description = this.contextValue === 'lexicon-entry' ? 'FL Term' : '';
  }
}

class BaekonResearchPanel {
  public static currentPanel: BaekonResearchPanel | undefined;
  public static readonly viewType = 'baekonResearch';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (BaekonResearchPanel.currentPanel) {
      BaekonResearchPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      BaekonResearchPanel.viewType,
      'BÆKON FL Research',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
      }
    );

    BaekonResearchPanel.currentPanel = new BaekonResearchPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public dispose() {
    BaekonResearchPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _update() {
    const webview = this._panel.webview;
    this._panel.webview.html = this._getHtmlForWebview(webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BÆKON FL Research</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
        }
        .research-panel {
            max-width: 800px;
            margin: 0 auto;
        }
        .section {
            margin-bottom: 30px;
            padding: 15px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 5px;
        }
        .section h2 {
            color: var(--vscode-textLink-foreground);
            margin-top: 0;
        }
        input, textarea {
            width: 100%;
            padding: 8px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 3px;
            margin: 5px 0;
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 3px;
            cursor: pointer;
            margin: 5px 5px 5px 0;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .results {
            margin-top: 15px;
            padding: 10px;
            background-color: var(--vscode-textCodeBlock-background);
            border-radius: 3px;
            white-space: pre-wrap;
            font-family: var(--vscode-editor-font-family);
        }
        .status {
            padding: 10px;
            margin: 10px 0;
            border-radius: 3px;
            background-color: var(--vscode-notifications-background);
            border-left: 4px solid var(--vscode-notificationsInfoIcon-foreground);
        }
    </style>
</head>
<body>
    <div class="research-panel">
        <h1>🔬 BÆKON FL Research Console</h1>
        
        <div class="status" id="status">
            Ready - Connected to BÆKON API
        </div>

        <div class="section">
            <h2>📚 FL Translation</h2>
            <textarea id="flText" placeholder="Enter FL text to translate..." rows="3"></textarea>
            <button onclick="translateText()">Translate</button>
            <div class="results" id="translationResults"></div>
        </div>

        <div class="section">
            <h2>📖 Lexicon Search</h2>
            <input type="text" id="lexiconQuery" placeholder="Search FL terms...">
            <button onclick="searchLexicon()">Search</button>
            <div class="results" id="lexiconResults"></div>
        </div>

        <div class="section">
            <h2>🗃️ Ana's Index Search</h2>
            <input type="text" id="indexQuery" placeholder="Search FL documents...">
            <button onclick="searchIndex()">Search</button>
            <div class="results" id="indexResults"></div>
        </div>

        <div class="section">
            <h2>📁 Research Vault</h2>
            <input type="text" id="vaultQuery" placeholder="Search vault documents...">
            <button onclick="searchVault()">Search</button>
            <button onclick="refreshVault()">Refresh</button>
            <div class="results" id="vaultResults"></div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const apiUrl = 'http://127.0.0.1:8787';

        async function translateText() {
            const text = document.getElementById('flText').value;
            if (!text.trim()) return;

            document.getElementById('translationResults').textContent = 'Translating...';
            
            try {
                const response = await fetch(\`\${apiUrl}/translate/research\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text, model: 'claude-3-5-sonnet-20241022' })
                });
                const result = await response.text();
                document.getElementById('translationResults').textContent = result;
            } catch (error) {
                document.getElementById('translationResults').textContent = 'Error: ' + error.message;
            }
        }

        async function searchLexicon() {
            const query = document.getElementById('lexiconQuery').value;
            document.getElementById('lexiconResults').textContent = 'Searching...';
            
            try {
                const response = await fetch(\`\${apiUrl}/lexicon/search?q=\${encodeURIComponent(query)}\`);
                const results = await response.json();
                
                let output = '';
                results.forEach(entry => {
                    output += \`\${entry.surface_form} → \${entry.gloss} (confidence: \${entry.confidence})\\n\`;
                });
                document.getElementById('lexiconResults').textContent = output || 'No results found';
            } catch (error) {
                document.getElementById('lexiconResults').textContent = 'Error: ' + error.message;
            }
        }

        async function searchIndex() {
            const query = document.getElementById('indexQuery').value;
            document.getElementById('indexResults').textContent = 'Searching...';
            
            try {
                const response = await fetch(\`\${apiUrl}/anas-index/search?q=\${encodeURIComponent(query)}\`);
                const results = await response.json();
                
                let output = '';
                results.forEach(doc => {
                    output += \`📄 \${doc.title}\\n\${doc.english_text || 'No description'}\\n\\n\`;
                });
                document.getElementById('indexResults').textContent = output || 'No results found';
            } catch (error) {
                document.getElementById('indexResults').textContent = 'Error: ' + error.message;
            }
        }

        async function searchVault() {
            const query = document.getElementById('vaultQuery').value;
            document.getElementById('vaultResults').textContent = 'Searching...';
            
            try {
                const response = await fetch(\`\${apiUrl}/vault/search?q=\${encodeURIComponent(query)}\`);
                const data = await response.json();
                
                let output = '';
                data.results.forEach(doc => {
                    output += \`📝 \${doc.title} (\${doc.category})\\n\${doc.content.substring(0, 200)}...\\n\\n\`;
                });
                document.getElementById('vaultResults').textContent = output || 'No results found';
            } catch (error) {
                document.getElementById('vaultResults').textContent = 'Error: ' + error.message;
            }
        }

        async function refreshVault() {
            document.getElementById('vaultResults').textContent = 'Refreshing vault...';
            vscode.postMessage({ command: 'refreshVault' });
        }
    </script>
</body>
</html>`;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const provider = new BaekonResearchProvider();
  vscode.window.registerTreeDataProvider('baekonExplorer', provider);

  // Register commands
  const openPanelCommand = vscode.commands.registerCommand('baekon.openResearchPanel', () => {
    BaekonResearchPanel.createOrShow(context.extensionUri);
  });

  const refreshCommand = vscode.commands.registerCommand('baekon.refreshVault', () => {
    provider.refresh();
  });

  const searchLexiconCommand = vscode.commands.registerCommand('baekon.searchLexicon', async () => {
    const query = await vscode.window.showInputBox({
      prompt: 'Enter FL term to search'
    });
    
    if (query) {
      const config = vscode.workspace.getConfiguration('baekon');
      const apiUrl = config.get('apiUrl', 'http://127.0.0.1:8787');
      
      try {
        const response = await axios.get(`${apiUrl}/lexicon/search?q=${encodeURIComponent(query)}`);
        const results = response.data.map((entry: LexiconEntry) => 
          `${entry.surface_form} → ${entry.gloss} (${entry.confidence})`
        ).join('\\n');
        
        vscode.window.showInformationMessage(`FL Lexicon Results:\\n${results}`);
      } catch (error) {
        vscode.window.showErrorMessage(`Error searching lexicon: ${error}`);
      }
    }
  });

  const translateCommand = vscode.commands.registerCommand('baekon.translateText', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active text editor');
      return;
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);
    
    if (!text) {
      vscode.window.showErrorMessage('No text selected');
      return;
    }

    const config = vscode.workspace.getConfiguration('baekon');
    const apiUrl = config.get('apiUrl', 'http://127.0.0.1:8787');
    
    try {
      const response = await axios.post(`${apiUrl}/translate/research`, {
        text: text,
        model: 'claude-3-5-sonnet-20241022'
      });
      
      // Show translation in a new document
      const doc = await vscode.workspace.openTextDocument({
        content: `FL Translation Result:\\n\\nOriginal: ${text}\\n\\nTranslation:\\n${response.data}`,
        language: 'markdown'
      });
      vscode.window.showTextDocument(doc);
    } catch (error) {
      vscode.window.showErrorMessage(`Translation error: ${error}`);
    }
  });

  context.subscriptions.push(
    openPanelCommand,
    refreshCommand,
    searchLexiconCommand,
    translateCommand
  );

  // Show welcome message
  vscode.window.showInformationMessage('BÆKON FL Research extension activated! 🔬');
}

export function deactivate() {}
