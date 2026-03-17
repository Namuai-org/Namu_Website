const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const http = require("node:http");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const { chromium } = require("playwright");

const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_DIR = path.join(process.cwd(), "public", "demo");
const VIDEO_DIR = path.join(process.cwd(), ".video-temp");
const WEBM_PATH = path.join(VIDEO_DIR, "namu-demo.webm");
const MP4_PATH = path.join(OUTPUT_DIR, "namu-demo.mp4");

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForServer(url, timeoutMs = 120000) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(url, (res) => {
        res.resume();
        if (res.statusCode && res.statusCode < 500) {
          resolve();
          return;
        }
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Server did not become ready: ${url}`));
          return;
        }
        setTimeout(attempt, 1000);
      });

      req.on("error", () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Server did not become ready: ${url}`));
          return;
        }
        setTimeout(attempt, 1000);
      });
    };

    attempt();
  });
}

function killProcess(child) {
  if (!child || child.killed) return;
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    return;
  }
  child.kill("SIGINT");
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, args, { stdio: "inherit" });
    ffmpeg.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`ffmpeg exited with code ${code}`));
    });
    ffmpeg.on("error", reject);
  });
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.rmSync(VIDEO_DIR, { recursive: true, force: true });
  fs.mkdirSync(VIDEO_DIR, { recursive: true });

  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  const server = spawn(npmCmd, ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(PORT)], {
    cwd: process.cwd(),
    stdio: "inherit",
  });

  let browser;
  let context;

  try {
    await waitForServer(`${BASE_URL}/demo-export`);

    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({
      viewport: { width: 1440, height: 810 },
      recordVideo: {
        dir: VIDEO_DIR,
        size: { width: 1440, height: 810 },
      },
      deviceScaleFactor: 1,
    });

    const page = await context.newPage();
    await page.goto(`${BASE_URL}/demo-export`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForSelector('[data-demo-complete="true"]', { timeout: 180000 });
    await wait(1000);

    const video = page.video();
    await context.close();
    await browser.close();

    if (!video) {
      throw new Error("Playwright did not produce a video file.");
    }

    const recordedPath = await video.path();
    fs.copyFileSync(recordedPath, WEBM_PATH);

    await runFfmpeg([
      "-y",
      "-i",
      WEBM_PATH,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      MP4_PATH,
    ]);

    console.log(`MP4 created at ${MP4_PATH}`);
  } finally {
    if (context) {
      try {
        await context.close();
      } catch {}
    }
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
    killProcess(server);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
