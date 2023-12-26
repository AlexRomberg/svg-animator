import { app, BrowserWindow } from "electron";

import { join, dirname } from "path";
import { format, fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({width: 800, height: 600, autoHideMenuBar:true});

    mainWindow.loadURL(format({
        pathname: join(__dirname, "svg-edit", "browser", "index.html"),
        protocol: "file:",
        slashes: true
    }));

    mainWindow.on("closed", function () {
        mainWindow = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});
