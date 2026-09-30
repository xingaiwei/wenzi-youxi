/**
 * 把 dist/ 打包结果内联成单个 HTML 片段（dist/wendao-single.html），
 * 便于作为独立页面分享或嵌入。先运行 `npm run build`。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
let html = readFileSync(join(dist, 'index.html'), 'utf8');

html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/g, (_, file) => {
  return `<style>${readFileSync(join(dist, file), 'utf8')}</style>`;
});
html = html.replace(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/g, (_, file) => {
  const js = readFileSync(join(dist, file), 'utf8').replace(/<\/script/gi, '<\\/script');
  return `<script type="module">${js}</script>`;
});
// 去掉外层文档骨架，只保留 head 与 body 的内容
html = html
  .replace(/<!doctype html>/i, '')
  .replace(/<\/?html[^>]*>/gi, '')
  .replace(/<\/?head>/gi, '')
  .replace(/<\/?body>/gi, '')
  .replace(/<meta charset[^>]*>|<meta name="viewport"[^>]*>/gi, '');
// 脚本需要在 #app 之后执行，模块脚本默认延迟执行，顺序无碍
writeFileSync(join(dist, 'wendao-single.html'), html.trim() + '\n');
console.log('written dist/wendao-single.html', (html.length / 1024).toFixed(1), 'KB');
