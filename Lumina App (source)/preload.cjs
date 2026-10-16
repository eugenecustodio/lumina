// Exposes a single, narrow function to the page: ask the Java engine to plan a route.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("lumina", {
  optimizeRoute: (request) => ipcRenderer.invoke("route:optimize", request),
});
