#!/usr/bin/env node
/**
 * 将 release-config.js 中的版本号同步到各 HTML 内联的 FALLBACK_VER（fetch 失败或 file:// 时使用）。
 * 正常线上访问不依赖 URL 参数；发版改 release-config.js 后可选执行： npm run sync-release
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;

const rcPath = path.join(root, "release-config.js");
const raw = fs.readFileSync(rcPath, "utf8");
const m = raw.match(/window\.__DEMO_APP_VERSION__\s*=\s*"([^"]*)"/);
if (!m) {
  console.error("未在 release-config.js 中找到 window.__DEMO_APP_VERSION__ = \"...\"");
  process.exit(1);
}
const ver = m[1];

const targets = ["index.html", "异常凭证-H5-demo.html"];
for (const name of targets) {
  const p = path.join(root, name);
  if (!fs.existsSync(p)) continue;
  let s = fs.readFileSync(p, "utf8");
  const next = s.replace(/var FALLBACK_VER = "[^"]*";/g, `var FALLBACK_VER = "${ver}";`);
  if (s === next) {
    console.log(name + "（FALLBACK_VER 已是 " + ver + "，跳过）");
  } else {
    fs.writeFileSync(p, next, "utf8");
    console.log(name + " → FALLBACK_VER=" + ver);
  }
}
console.log("完成。请 git add 后推送。");
