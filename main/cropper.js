'use strict';

const {format: formatUrl} = require('url');
const electron = require('electron');
const isDev = require('electron-is-dev');
const {resolve} = require('app-root-path');

const {BrowserWindow} = electron;
const devPath = 'http://localhost:8000/cropper';

const prodPath = formatUrl({
  pathname: resolve('renderer/out/cropper/index.html'),
  protocol: 'file:',
  slashes: true
});

const url = isDev ? devPath : prodPath;

let croppers = [];
let shouldIgnoreBlur = false;

const openCropperWindow = async () => {
  croppers = [];
  const {screen} = electron;
  const displays = screen.getAllDisplays();

  for(const index in displays) {
    const display = displays[index];

    const {id, bounds} = display;
    const {x, y, width, height} = bounds;

    const cropper = new BrowserWindow({
      x,
      y,
      width,
      height,
      hasShadow: false,
      enableLargerThanScreen: true,
      resizable: false,
      moveable: false,
      frame: false,
      transparent: true,
      show: false
    });

    cropper.displayId = id;

    cropper.loadURL(url);
    cropper.setAlwaysOnTop(true, 'screen-saver', 1);

    cropper.webContents.on('did-finish-load', function() {
      const isActiveDisplay = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).id === id;
      cropper.webContents.send('display', {id, x, y, width, height, isActiveDisplay});
    });

    cropper.on('focus', () => {
      croppers.forEach(c => c.webContents.send('display', {isActiveDisplay: c.displayId === id}));
    });

    cropper.on('closed', () => {
      croppers.forEach(c => c.destroy());
    });

    if (isDev) {
      cropper.openDevTools({mode: 'detach'});
    }

    croppers.push(cropper);
  }

  croppers.forEach(c => c.show());
};

const ignoreBlur = () => {
  shouldIgnoreBlur = true;
};

const restoreBlur = () => {
  shouldIgnoreBlur = false;
  // cropper.focus();
};

const closeCropperWindow = () => {
  // cropper.close();
};

module.exports = {
  openCropperWindow,
  closeCropperWindow,
  ignoreBlur,
  restoreBlur
};
