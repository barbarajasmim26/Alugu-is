const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let serverProcess;
const PORT = 3000;

function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error('Servidor não iniciou a tempo.'));
        } else {
          setTimeout(check, 800);
        }
      });
      req.setTimeout(2000, () => req.destroy());
    };
    check();
  });
}

function startServer() {
  return new Promise((resolve, reject) => {
    const projectDir = path.resolve(__dirname, '..');
    const isWin = process.platform === 'win32';
    const cmd = isWin ? 'cmd.exe' : 'sh';
    const args = isWin
      ? ['/c', 'set NODE_ENV=development && pnpm exec tsx server/_core/index.ts']
      : ['-lc', 'NODE_ENV=development pnpm exec tsx server/_core/index.ts'];

    serverProcess = spawn(cmd, args, {
      cwd: projectDir,
      env: { ...process.env, NODE_ENV: 'development' },
      windowsHide: true,
      stdio: 'ignore'
    });

    serverProcess.on('error', reject);
    waitForServer(`http://localhost:${PORT}`).then(resolve).catch(reject);
  });
}

async function createWindow() {
  try {
    await startServer();
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1100,
      minHeight: 700,
      autoHideMenuBar: true,
      title: 'Sistema Mesquita',
      webPreferences: {
        contextIsolation: true,
        sandbox: true,
        preload: path.join(__dirname, 'preload.cjs')
      }
    });
    await mainWindow.loadURL(`http://localhost:${PORT}`);
  } catch (error) {
    dialog.showErrorBox('Erro ao iniciar o Sistema Mesquita', String(error && error.message ? error.message : error));
    app.quit();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (serverProcess && !serverProcess.killed) {
    try { serverProcess.kill(); } catch {}
  }
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (serverProcess && !serverProcess.killed) {
    try { serverProcess.kill(); } catch {}
  }
});
