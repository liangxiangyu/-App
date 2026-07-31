import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appDir = join(root, "app");
const css = readFileSync(join(appDir, "shared.css"), "utf8");
const skip = new Set(["index.html", "preview.html", "mobile-app.html"]);
const navRe = /location\.href\s*=\s*['"]([\w-]+)\.html['"]/g;

const pages = {};
for (const file of readdirSync(appDir).filter((f) => f.endsWith(".html") && !skip.has(f))) {
  const id = file.replace(/\.html$/, "");
  const html = readFileSync(join(appDir, file), "utf8");
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) continue;

  let body = bodyMatch[1];
  body = body.replace(navRe, "parent.__nav('$1')");

  const page = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"><style>${css}</style><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></head><body>${body}</body></html>`;
  pages[id] = page;
}

const mobileApp = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>督察APP</title>
  <style>html,body{margin:0;height:100%;overflow:hidden;background:#f3f4f6}#app{width:100%;height:100%;border:none;display:block}</style>
</head>
<body>
  <iframe id="app" title="督察APP" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
  <script>
  var P=${JSON.stringify(pages)};
  window.__nav=function(id){
    if(!P[id]) return;
    document.getElementById('app').srcdoc=P[id];
    if(location.hash!=='#'+id) location.replace('#'+id);
  };
  window.addEventListener('hashchange',function(){
    var id=(location.hash||'').slice(1);
    if(id&&P[id]) document.getElementById('app').srcdoc=P[id];
  });
  var start=(location.hash||'').slice(1);
  window.__nav(start&&P[start]?start:'problem-list');
  <\/script>
</body>
</html>
`;

writeFileSync(join(appDir, "mobile-app.html"), mobileApp, "utf8");

const previewUrl = process.argv[2] || "mobile-app.html";
const qrPath = join(appDir, "qr-preview.svg");
execSync(`npx --yes qrcode "${previewUrl}" -o "${qrPath}" -m 1 -w 120`, {
  stdio: "inherit",
  cwd: root,
});

console.log(`Built mobile-app.html (${Object.keys(pages).length} pages)`);
console.log(`QR preview URL: ${previewUrl}`);
console.log(`QR image: ${qrPath}`);
