# 项目上下文（给 Cursor / 协作者）

本文档用于换工作区、新开对话时快速恢复背景。**发版时版本号只改 `release-config.js`，不要改本文件里的版本字样（除非同步说明）。**

## 项目是什么

- 邻药汇仓店管理系统的 **静态 HTML 演示**：复核台 / 销售订单详情、异常提报弹窗、复制 H5 分享链接。
- **异常凭证 H5**（`异常凭证-H5-demo.html`）：销售工单异常的业务信息快照页，按模块展示工单信息、原始订单、三渠道商品对比、价格、批次溯源与分拣、挂网图与仓店图（各最多 6 张）。分享链接通过查询参数注入数据（正式环境可由后端拼 URL 或直出页面）。

## 仓库文件（当前）

| 文件 | 说明 |
|------|------|
| `release-config.js` | **版本号唯一真源**：`window.__DEMO_APP_VERSION__`。发版改此处；可选跑 `sync-release.mjs` 同步 HTML 内 **FALLBACK_VER**。 |
| `sync-release.mjs` | 将版本写入各 HTML 的 `FALLBACK_VER`（`fetch` 失败、`file://` 打开时使用）。 |
| `package.json` | `npm run sync-release` 等同于 `node sync-release.mjs`。 |
| `.github/workflows/sync-release.yml` | 推送修改 `release-config.js` 时自动跑同步并提交 HTML（亦可 Actions 里手动 Run workflow）。 |
| `异常凭证-H5-demo.html` | 异常凭证页；`fetch(release-config.js, { cache: 'no-store' })` 取版本，写入 meta 与页脚。 |
| `cursor/rules/演示发版版本号.mdc` | 约定：助手发版时只维护 `release-config.js`。 |
| `CONTEXT.md` | 本说明。 |

> **`index.html`** 与异常凭证页：**地址栏 URL 无需带版本参数**。页面用 **`fetch('release-config.js', { cache: 'no-store' })`** 拉取配置（刷新即向服务器重新要最新 `release-config.js`），版本号展示与分享链接均基于该结果。分享出去的 H5 链接里 **不再附加 `v=`**（业务 query 如 `ticket` 等仍保留）。

## 版本与缓存

- **浏览器侧**：`cache: 'no-store'` 尽量避免沿用本地旧 `release-config.js`；**入口 HTML** 仍可能被 CDN/浏览器按站点策略缓存，若极端情况下整页过旧，需依赖托管方缓存策略或强制刷新。
- **发版**：① 改 `release-config.js`；②（建议）**`npm run sync-release`** 或推送后由 **GitHub Actions** 同步 HTML 内 **FALLBACK_VER**，再 **`git add` / push**。

## GitHub Pages / 可复制链接

- 本地 `file://` 打开的链接他人无法访问。
- 主站脚本中应配置 **`GITHUB_PAGES_BASE`**（站点根 URL，**末尾带 /**），生成分享链接时使用该基址 + `异常凭证-H5-demo.html` + 查询参数。
- 部署时把 `index.html`（若有）、`异常凭证-H5-demo.html`、`release-config.js`、`cursor/rules`（或你本机 `.cursor/rules`）等一并推送。

## 异常凭证 URL 参数（摘要）

常用：`ticket`、`desc`、`serial`、`extOrder`、`excType`、`storeProduct`、`line`、`reporter`、`attachments` / `attachCount`、`orderStatus`、`sourcePlatform`、价格/溯源/分拣相关字段等。完整逻辑见 `异常凭证-H5-demo.html` 内脚本。

## 交互约定（演示）

- 复核台 / 销售订单详情：**提报异常** 悬停绿色描边 + 气泡（整单 / 商品批次）。
- 提交后二次弹窗：复制 H5 链接到微信技术支持群。

---

*由助手生成；后续产品变更可在此补充，或直接在对话里 @ 本文件。*
