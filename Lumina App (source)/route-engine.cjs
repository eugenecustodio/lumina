// Starts the Java route engine once and talks to it over stdin/stdout, one JSON object per line.
// If Java can't start or doesn't answer, requests resolve with { ok: false, error } and Lumina
// falls back to its built-in routing.
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

class RouteEngine {
  constructor(engineDir) {
    this.engineDir = engineDir;
    this.child = null;
    this.buffer = "";
    this.pending = new Map();
    this.nextRequestId = 1;
    this.lastError = null;
  }

  javaCommand() {
    const exe = process.platform === "win32" ? "java.exe" : "java";
    const bundled = path.join(this.engineDir, "runtime", "bin", exe);
    return fs.existsSync(bundled) ? bundled : exe; // fall back to a Java on PATH
  }

  start() {
    if (this.child) return;
    const jar = path.join(this.engineDir, "lumina-engine.jar");
    if (!fs.existsSync(jar)) throw new Error("Route engine file is missing");
    const child = spawn(this.javaCommand(), ["-Xmx256m", "-XX:TieredStopAtLevel=1", "-Xshare:auto", "-jar", jar], {
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
    this.child = child;
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      this.buffer += chunk;
      let newline;
      while ((newline = this.buffer.indexOf("\n")) >= 0) {
        const line = this.buffer.slice(0, newline).trim();
        this.buffer = this.buffer.slice(newline + 1);
        if (line) this.receive(line);
      }
    });
    child.stderr.on("data", () => {});
    child.stdin.on("error", () => {});
    child.on("error", (error) => this.fail(child, `Java could not start: ${error.message}`));
    child.on("exit", (code) => this.fail(child, `Java engine stopped (exit code ${code})`));
  }

  receive(line) {
    let message;
    try { message = JSON.parse(line); } catch { return; }
    const waiting = this.pending.get(message.requestId);
    if (!waiting) return;
    this.pending.delete(message.requestId);
    clearTimeout(waiting.timer);
    waiting.resolve(message);
  }

  fail(child, reason) {
    if (this.child !== child) return;
    this.child = null;
    this.buffer = "";
    this.lastError = reason;
    for (const waiting of this.pending.values()) { clearTimeout(waiting.timer); waiting.resolve({ ok: false, error: reason }); }
    this.pending.clear();
  }

  request(payload, timeoutMs = 15000) {
    return new Promise((resolve) => {
      try { this.start(); } catch (error) { resolve({ ok: false, error: error.message }); return; }
      const requestId = this.nextRequestId++;
      const timer = setTimeout(() => { this.pending.delete(requestId); resolve({ ok: false, error: "Java engine did not answer in time" }); }, timeoutMs);
      this.pending.set(requestId, { resolve, timer });
      this.child.stdin.write(JSON.stringify({ ...payload, requestId }) + "\n");
    });
  }

  stop() {
    const child = this.child;
    this.child = null;
    if (!child) return;
    try { child.stdin.end(); } catch {}
    try { child.kill(); } catch {}
  }
}

module.exports = { RouteEngine };
