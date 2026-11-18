// GitHub Pages serves 404.html for any path that has no file — including
// /<blog-slug> deep links. Copying the built SPA entry into 404.html lets
// the app boot on those URLs and open the right article client-side.
import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
console.log('dist/404.html written — SPA fallback for /<slug> deep links')
