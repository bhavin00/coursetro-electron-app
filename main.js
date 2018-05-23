const isDev = require('electron-is-dev');

if (isDev) {
    require('electron-reload')(__dirname);
}

const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const { autoUpdater } = require("electron-updater");

const menu = Menu.buildFromTemplate([
    {
        label: 'Menu',
        submenu: [
            { label: 'Adjust Notification Value' },
            {
                label: 'CoinMarketCap',
                click() {
                    shell.openExternal('http://coinmarketcap.com');
                },
                accelerator: 'CmdOrCtrl+Shift+C'
            },
            { type: 'separator' },
            {
                label: 'Exit',
                click() {
                    app.quit()
                },
                accelerator: 'CmdOrCtrl+Shift+Q'
            }
        ]
    }
])

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function autoUpdateEvents() {
    /* autoUpdater.on('checking-for-update', () => {
      console.log('Checking for update...');
    })
    autoUpdater.on('update-available', (ev, info) => {
      console.log('Update available.');
    }) */

    autoUpdater.on('update-not-available', (ev, info) => {
        console.log(update - not - available);
        setTimeout(function () { autoUpdater.checkForUpdates(); }, 60000 * 60 * 1); // 2hr
    })

    autoUpdater.on('error', (ev, err) => {
        console.log("In Error");
        setTimeout(function () { autoUpdater.checkForUpdates(); }, 60000 * 60 * 1); // 2hr
    })

    autoUpdater.on('download-progress', (ev, progressObj) => {
        console.log('Download progress...');
    })

    autoUpdater.on('update-downloaded', async (event, releaseNotes, releaseName) => {
        let currentVersion = parseInt(event.version.substring(event.version.lastIndexOf('.') + 1, 1000));
        if (currentVersion === 0 || currentVersion % 2 === 0) {
            autoUpdater.quitAndInstall()
        } else {
            let message = app.getName() + ' ' + event.version + ' is now available. It will be installed the next time you restart the application.';

            // Ask user to update the app
            dialog.showMessageBox({
                type: 'question',
                buttons: ['Install', 'Later'],
                defaultId: 0,
                message: 'A new version of ' + app.getName() + ' has been downloaded',
                detail: message
            }, (response) => {
                if (response === 0) {
                    setTimeout(() => autoUpdater.quitAndInstall(), 1);
                }
            });

        }

    });

    setTimeout(function () { autoUpdater.checkForUpdates(); }, 1000 * 10); // 10 sec
}

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minHeight: 600,
        minWidth: 800
    })

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
        app.quit()
    })

    Menu.setApplicationMenu(menu);

    if (!isDev) {
        autoUpdateEvents();
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        // console.log(process.platform);
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('update-notify-value', function (event, arg) {
    win.webContents.send('targetPriceVal', arg);
})
