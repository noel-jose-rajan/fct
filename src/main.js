const path = require('path');
const os = require('os');
const fs = require('fs');
const er = require("electron-reload")
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

er(__dirname,{})

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

let mainWindow;

// Main Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 950,
    height: 450,
    // icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
  }
  });

  // Show devtools automatically if in development
  if (isDev) { mainWindow.webContents.openDevTools(); }

   mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));


}



// When the app is ready, create the window
app.on('ready', () => {
  createMainWindow();

  // Remove variable from memory
  mainWindow.on('closed', () => (mainWindow = null));
});


ipcMain.on('create-folder', async (event, folder) => {

  let path = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })

  try {
    if (path.canceled) return dialog.showErrorBox("Error", "Operation Canceled")

    console.log("Core Path", path.filePaths[0]);

    let masterFolderName = `${path.filePaths[0]}/${folder.name}`
    fs.mkdirSync(masterFolderName)

    switch (folder.type) {
      case "VIDEO":
        fs.mkdirSync(`${masterFolderName}/RENDERS`)
        fs.mkdirSync(`${masterFolderName}/SOURCE`)
        break;

      case "VIDEO LOCALISATION":
        fs.mkdirSync(`${masterFolderName}/RENDERS`)
        folder.languages.forEach(language => {
          fs.mkdirSync(`${masterFolderName}/RENDERS/${language}`)
        });

        fs.mkdirSync(`${masterFolderName}/SOURCE`)
        folder.languages.forEach(language => {
          fs.mkdirSync(`${masterFolderName}/SOURCE/${language}`)
        });
        break;

        case "STATIC":
          fs.mkdirSync(`${masterFolderName}/PSD`)
          fs.mkdirSync(`${masterFolderName}/JPEG_PNG`)
          fs.mkdirSync(`${masterFolderName}/RENDER_LOC`)
          fs.mkdirSync(`${masterFolderName}/RENDER_LOC/DISPLAY ADS`)
          fs.mkdirSync(`${masterFolderName}/RENDER_LOC/END CARDS`)
          fs.mkdirSync(`${masterFolderName}/SOURCE_LOC`)
          break;

        case "STATIC LOCALISATION":
          fs.mkdirSync(`${masterFolderName}/PSD`)
          fs.mkdirSync(`${masterFolderName}/JPEG_PNG`)
          fs.mkdirSync(`${masterFolderName}/RENDER_LOC`)
          fs.mkdirSync(`${masterFolderName}/RENDER_LOC/DISPLAY ADS`)
          fs.mkdirSync(`${masterFolderName}/RENDER_LOC/END CARDS`)
          fs.mkdirSync(`${masterFolderName}/SOURCE_LOC`)

          folder.languages.forEach(language => {
            fs.mkdirSync(`${masterFolderName}/RENDER_LOC/END CARDS/${language}`)
          });

          folder.languages.forEach(language => {
            fs.mkdirSync(`${masterFolderName}/RENDER_LOC/DISPLAY ADS/${language}`)
          });
          folder.languages.forEach(language => {
            fs.mkdirSync(`${masterFolderName}/SOURCE_LOC/${language}`)
          });
          break;
    
      default:
        break;
    }
    
  } catch (error) {

    return dialog.showErrorBox("Error", error.message)
    
  }

  

  


    console.log({...folder, basePath: path.filePaths[0]});
    
  
  
 
  // Code to create folder here...
});



// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

// Open a window if none are open (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

