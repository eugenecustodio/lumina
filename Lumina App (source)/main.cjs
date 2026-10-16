const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { RouteEngine } = require("./route-engine.cjs");

app.setName("Lumina");
// Keep using the data folder from earlier versions (%APPDATA%\Wayline Warehouse) so nothing is lost after the rename.
app.setPath("userData", path.join(app.getPath("appData"), "Wayline Warehouse"));

// The Java route engine and its runtime live outside the app archive, in resources/java.
const engineDir = app.isPackaged ? path.join(process.resourcesPath, "java") : path.join(__dirname, "java");
const routeEngine = new RouteEngine(engineDir);

ipcMain.handle("route:optimize", async (_event, request) => {
  if (!request || typeof request !== "object") return { ok: false, error: "Invalid route request" };
  return routeEngine.request({ ...request, type: "optimize" });
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1040,
    minHeight: 700,
    backgroundColor: "#f3f5f4",
    autoHideMenuBar: true,
    icon: path.join(__dirname, "build", "icon.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on("will-quit", () => routeEngine.stop());
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
