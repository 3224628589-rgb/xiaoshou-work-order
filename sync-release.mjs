#!/usr/bin/env node
/**
 * 根据 release-config.js 里的版本号，同步各 HTML 中 <script src="release-config.js?v=...">
 * 避免浏览器长期缓存旧脚本。发版：只改 release-config.js 后执行： node sync-release.mjs
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
  let next = s.replace(/release-config\.js\?v=[^"'>\s]+/g, `release-config.js?v=${ver}`);
  next = next.replace(
    /(\n\s*\?\s*window\.__DEMO_APP_VERSION__\s*\n\s*:\s*")[^"]*(";)/g,
    `$1${ver}$2`
  );
  if (s === next) {
    console.log(name + "（已是 " + ver + "，跳过）");
  } else {
    fs.writeFileSync(p, next, "utf8");
    console.log(name + " → ?v=" + ver + " + 内联回退版本");
  }
}
console.log("完成。请 git add 后推送。");
