const { app, BaseWindow, WebContentsView } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

const createWindow = () => {
  const win = new BaseWindow({ width: 1200, height: 800 });

  const view1 = new WebContentsView();
  const view2 = new WebContentsView({ webPreferences: { partition: 'persist:release-app' } });

  const view1Url = 'http://localhost:8000/scripts/check-releases.html';
  win.contentView.addChildView(view1);
  view1.webContents.loadURL(view1Url);
  view1.webContents.setWindowOpenHandler(({ url }) => {
    view2.webContents.loadURL(url);
    return { action: 'deny' };
  });

  const view2Url = `file://${path.resolve('empty.html')}`;
  const prefillScript = fs.readFileSync(path.resolve('prefill-build-info.js'), 'utf8');
  win.contentView.addChildView(view2);
  view2.webContents.loadURL(view2Url);
  view2.webContents.on('did-finish-load', () => {
    view2.webContents.executeJavaScript(prefillScript);
  });

  function resizeViews() {
    const bounds = win.getBounds();
    const width = bounds.width;
    const height = bounds.height;
    const halfWidth = Math.floor(width / 2);

    view1.setBounds({ x: 0, y: 0, width: halfWidth, height });
    view2.setBounds({ x: halfWidth, y: 0, width: halfWidth, height });
  }

  resizeViews();
  win.on('resize', resizeViews);
};

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});
