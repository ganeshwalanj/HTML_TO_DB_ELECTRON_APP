const { app, BrowserWindow, ipcMain } = require("electron");
const { startInsertion } = require("./app");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: `${__dirname}/preload.js`, // Use preload.js for security
      contextIsolation: true, // Set to true in production for security
      nodeIntegration: false, // Allows `require` in renderer.js
    },
  });

  mainWindow.loadFile("./View/index.html");

  ipcMain.on("start-insertion", (event, args) => {
    const sendStatusUpdate = (type, message) => {
      event.sender.send("status-update", type, message);
    };
    startInsertion(args, sendStatusUpdate).catch((err) => {
      sendStatusUpdate(`An error occurred: ${err.message}`);
    });
  });
});
