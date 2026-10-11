import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

// Checks what is committed in Git (what Vercel will actually see)
const tracked = new Set(execSync('git ls-files', { encoding: 'utf8' }).split('\n').map((s) => s.trim()).filter(Boolean))
const lower = new Map([...tracked].map((f) => [f.toLowerCase(), f]))
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const declared = new Set([...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})])
const exts = ['', '.js', '.jsx', '.json', '.css', '.png', '.jpg', '.jpeg', '.svg', '.webp']
const re = /(?:from\s+|import\s*\(\s*|import\s+)['"]([^'"]+)['"]/g

let problems = 0
const report = (msg) => { problems++; console.log('PROBLEM:', msg) }

for (const file of tracked) {
  if (!file.startsWith('src/') || !/\.(js|jsx)$/.test(file)) continue
  const code = fs.readFileSync(file, 'utf8')
  for (const m of code.matchAll(re)) {
    const spec = m[1]
    if (spec.startsWith('.')) {
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), spec))
      const candidates = [...exts.map((e) => resolved + e), resolved + '/index.js', resolved + '/index.jsx']
      if (candidates.some((c) => tracked.has(c))) continue
      const wrong = candidates.map((c) => lower.get(c.toLowerCase())).find(Boolean)
      if (wrong) report(`${file} imports "${spec}" but Git has "${wrong}" (upper/lower case does not match)`)
      else report(`${file} imports "${spec}" but that file is NOT committed in Git`)
    } else {
      const name = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]
      if (!declared.has(name)) report(`${file} uses package "${name}" but it is not listed in package.json`)
    }
  }
}

console.log(problems === 0 ? 'OK: no import problems found in what is committed.' : `\n${problems} problem(s) found.`)