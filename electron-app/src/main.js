const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const axios = require('axios');
const chokidar = require('chokidar');
const fs = require('fs');

class BaekonResearchApp {
  constructor() {
    this.mainWindow = null;
    this.apiUrl = 'http://127.0.0.1:8787';
    this.vaultPath = path.resolve(__dirname, '../../../BAEKON-Research-Vault');
    this.vaultWatcher = null;
  }

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      },
      titleBarStyle: 'hiddenInset',
      icon: path.join(__dirname, '../assets/icon.png')
    });

    this.mainWindow.loadFile(path.join(__dirname, '../../mystery-explorer.html'));


    // Open DevTools in development
    if (process.argv.includes('--dev')) {
      this.mainWindow.webContents.openDevTools();
    }

    this.setupMenu();
    this.setupIPC();
    this.initializeVaultWatcher();
  }

  setupMenu() {
    const template = [
      {
        label: 'BÆKON Research',
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'File',
        submenu: [
          {
            label: 'Open Vault Folder',
            accelerator: 'CmdOrCtrl+O',
            click: () => this.openVaultFolder()
          },
          {
            label: 'Refresh Vault',
            accelerator: 'CmdOrCtrl+R',
            click: () => this.refreshVault()
          },
          { type: 'separator' },
          {
            label: 'Export Research',
            click: () => this.exportResearch()
          }
        ]
      },
      {
        label: 'Research',
        submenu: [
          {
            label: 'Search Ana\'s Index',
            accelerator: 'CmdOrCtrl+Shift+A',
            click: () => this.focusSearch('anas')
          },
          {
            label: 'Search Lexicon',
            accelerator: 'CmdOrCtrl+Shift+L',
            click: () => this.focusSearch('lexicon')
          },
          {
            label: 'Translate Text',
            accelerator: 'CmdOrCtrl+T',
            click: () => this.focusSearch('translate')
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  setupIPC() {
    // API proxy to avoid CORS issues
    ipcMain.handle('api-request', async (event, { method, endpoint, data }) => {
      try {
        const response = await axios({
          method,
          url: `${this.apiUrl}${endpoint}`,
          data
        });
        return { success: true, data: response.data };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // Vault operations
    ipcMain.handle('vault-stats', async () => {
      try {
        const response = await axios.get(`${this.apiUrl}/vault/stats`);
        return response.data;
      } catch (error) {
        return { error: error.message };
      }
    });

    ipcMain.handle('open-vault-folder', () => {
      this.openVaultFolder();
    });
  }

  initializeVaultWatcher() {
    if (fs.existsSync(this.vaultPath)) {
      this.vaultWatcher = chokidar.watch(this.vaultPath, {
        ignored: /(^|[\\/\\\\])\\../, // ignore dotfiles
        persistent: true
      });

      this.vaultWatcher
        .on('add', (path) => this.notifyVaultChange('added', path))
        .on('change', (path) => this.notifyVaultChange('changed', path))
        .on('unlink', (path) => this.notifyVaultChange('removed', path));

      console.log(`Vault watcher initialized: ${this.vaultPath}`);
    }
  }

  notifyVaultChange(type, filePath) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('vault-changed', { type, path: filePath });
    }
  }

  openVaultFolder() {
    const { shell } = require('electron');
    if (fs.existsSync(this.vaultPath)) {
      shell.openPath(this.vaultPath);
    } else {
      dialog.showErrorBox('Vault Not Found', `Research vault not found at: ${this.vaultPath}`);
    }
  }

  refreshVault() {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('refresh-vault');
    }
  }

  focusSearch(type) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('focus-search', type);
    }
  }

  async exportResearch() {
    const { dialog } = require('electron');
    const result = await dialog.showSaveDialog(this.mainWindow, {
      title: 'Export Research Data',
      defaultPath: 'baekon-research-export.json',
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (!result.canceled) {
      try {
        // Gather all research data
        const vaultStats = await axios.get(`${this.apiUrl}/vault/stats`);
        const lexiconSample = await axios.get(`${this.apiUrl}/lexicon/search?q=`);
        
        const exportData = {
          timestamp: new Date().toISOString(),
          vault: vaultStats.data,
          lexicon_sample: lexiconSample.data.slice(0, 100),
          metadata: {
            version: '1.0.0',
            exported_by: 'BÆKON Research Desktop'
          }
        };

        fs.writeFileSync(result.filePath, JSON.stringify(exportData, null, 2));
        dialog.showMessageBox(this.mainWindow, {
          type: 'info',
          title: 'Export Complete',
          message: `Research data exported to: ${result.filePath}`
        });
      } catch (error) {
        dialog.showErrorBox('Export Failed', error.message);
      }
    }
  }
}

const baekonApp = new BaekonResearchApp();

app.whenReady().then(() => {
  baekonApp.createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      baekonApp.createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (baekonApp.vaultWatcher) {
    baekonApp.vaultWatcher.close();
  }
});
