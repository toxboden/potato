# Potato — 可部署包

这个文件夹就是完整的 Potato 应用，放到任何静态网站空间（GitHub Pages、Netlify、Cloudflare Pages、你自己的域名）就能用。
部署后在手机浏览器打开，用「添加到主屏幕」（iPhone 的 Safari 分享菜单 / 安卓 Chrome 的菜单或安装提示），
桌面上就会出现土豆图标，打开时没有浏览器地址栏，第一次打开后离线也能用。

## 文件

- `index.html` — 应用本体（和 Claude 链接里的是同一个版本：20261014-1102）
- `manifest.webmanifest` — 应用名称、图标、主题色（让手机把它当 App 安装）
- `sw.js` — 离线缓存脚本（首次打开后把应用和字体存在手机里）
- `icons/` — 应用图标（192、512、maskable、Apple Touch）

## 放到 GitHub Pages（最简单）

1. 在 GitHub 新建一个仓库，例如 `potato`（或直接放进 `huidadou.github.io` 里的一个子文件夹 `potato/`）。
2. 把这个文件夹里的所有文件上传到仓库根目录（或子文件夹），保持目录结构不变。
3. 仓库 Settings → Pages → Source 选 "Deploy from a branch"，分支选 main，目录选 /（root），保存。
4. 一两分钟后打开 `https://<你的用户名>.github.io/potato/`（或对应路径）。必须是 https，离线缓存和安装才会生效。
5. 手机打开这个网址 → 添加到主屏幕。

## 更新版本

每次拿到新的 `index.html`，连同新的 `sw.js` 一起覆盖上传。`sw.js` 里的版本号每次构建都会变，
手机会在下一次打开时自动换成新版本（偶尔需要关掉再开一次）。

## 关于进度

- 在 **Claude 链接** 里打开：进度会同步到你的 Claude 账号，换设备自动跟着走。
- 在 **你自己的域名** 里打开：没有 Claude 账号可用，进度只存在那台设备上；
  设置 → Progress 里有「Copy backup code / Paste a code」，可以把进度搬到另一台设备。
