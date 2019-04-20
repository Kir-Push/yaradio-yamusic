const path = require('path');
const fs = require('mz/fs');
const {
  app,
  BrowserWindow
} = require('electron');
const store = require('./modules/store/store');
const ctxMenu = require('./modules/menu/ctxMenu');
const globalShortcut = require('./modules/globalShortcut');

if (process.env.node_env == 'dev')
  require('electron-debug')({
    enabled: true,
    showDevTools: 'undocked'
  });

let win

let appRunning = app.requestSingleInstanceLock();

if (!appRunning) {
  app.quit();
}

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.focus();
  }
})

function createWindow() {
  const lastWindowState = store.get('lastWindowState'),
    lastApp = store.get('lastApp');

  const win = new BrowserWindow({
    title: 'YaRadio',
    show: false,
    x: lastWindowState.x,
    y: lastWindowState.y,
    height: lastWindowState.height || 700,
    width: lastWindowState.width || 848,
    icon: path.join(__dirname, 'media/icon', 'yaradio.png'),
    titleBarStyle: 'hiddenInset',
    minHeight: 700,
    minWidth: 848,
    autoHideMenuBar: true,
    backgroundColor: '#fff',
    webPreferences: {
      preload: path.join(__dirname, 'modules/js', 'browser.js'),
      nodeIntegration: false,
      plugins: true
    }
  })
  win.loadURL((() => {
      return 'https://music.yandex.ru/'
  })());

  win.on('close', e => {
    if (!store.get('quit?')) {
      e.preventDefault();
    }

    switch (process.platform) {
      case 'win32':
        win.hide();
        break;
      case 'linux':
        win.minimize();
        break;
      case 'darwin':
        app.hide();
        break;
      default:
    }
  });

  win.on('page-title-updated', e => {
    let history = e.sender.webContents.history;
      win.setTitle('YaMusic');
      if (process.platform !== 'darwin') {
        win.setIcon(path.join(__dirname, 'media/icon', 'yamusic_32x32.png'));
      }
    e.preventDefault();
  });

  return win
}

app.on("ready", () => {
  win = createWindow()
  ctxMenu.create(win, app);
  globalShortcut.init(win, app);
  win.setMenu(null);

  let page = win.webContents;
  page.on('dom-ready', () => {
    page.insertCSS(fs.readFileSync(path.join(__dirname, '/modules/css', 'css.css'), 'utf8'));
    win.show();
  })
})

app.on('before-quit', () => {
  store.set('quit?', true);

  if (!win.isFullScreen()) {
    store.set('lastWindowState', win.getBounds());
  }

  store.set('lastApp', win.getTitle());
});
