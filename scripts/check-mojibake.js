const fs = require('fs')
const path = require('path')

const repoRoot = path.resolve(__dirname, '..')
const includeExtensions = new Set(['.html', '.js', '.css', '.json', '.md', '.ts', '.tsx'])
const ignoredDirectories = new Set([
  '.git',
  '.vscode',
  'node_modules',
  'vendor',
  'icons',
  'images'
])

const baselineFiles = new Set([
  'anki/index.html',
  'ap-world-history-unit-1.html',
  'ap-world-history-unit-2.html',
  'ap-world-history-unit-3.html',
  'ap-world-history-unit-4.html',
  'assets/site.js',
  'assets/text-fixes.js',
  'dashboard.html',
  'geography-library.html',
  'grade-10-math.html',
  'grade-10.html',
  'grade-11.html',
  'grade-9-advanced.html',
  'profile.html',
  'schedule.html',
  'settings.html',
  'subject-library-2.html'
])

const ignoredFiles = new Set([
  'scripts/check-mojibake.js'
])

const suspiciousMatchers = [
  { label: 'A-tilde', regex: /\u00C3/ },
  { label: 'A-circumflex', regex: /\u00C2/ },
  { label: 'cp1252-apostrophe-garble', regex: /\u00E2\u20AC\u2122/ },
  { label: 'cp1252-quote-garble', regex: /\u00E2\u20AC\u0153/ },
  { label: 'cp1252-dash-garble', regex: /\u00E2\u20AC/ },
  { label: 'replacement-char', regex: /\uFFFD/ },
  { label: 'utf8-bom-garble', regex: /\u00EF\u00BB\u00BF/ }
]

function normalizeRelative(targetPath) {
  return path.relative(repoRoot, targetPath).split(path.sep).join('/')
}

function collectFiles(startPath, results) {
  const stats = fs.statSync(startPath)
  if (stats.isDirectory()) {
    const name = path.basename(startPath)
    if (ignoredDirectories.has(name)) return
    for (const entry of fs.readdirSync(startPath)) {
      collectFiles(path.join(startPath, entry), results)
    }
    return
  }

  if (!includeExtensions.has(path.extname(startPath).toLowerCase())) return
  if (path.basename(startPath).toLowerCase().startsWith('_tmp')) return
  results.push(startPath)
}

function getScanTargets() {
  const argPaths = process.argv.slice(2)
  if (argPaths.length) {
    return argPaths
      .map(function (target) {
        return path.resolve(process.cwd(), target)
      })
      .filter(function (target) {
        return fs.existsSync(target) && !fs.statSync(target).isDirectory()
      })
  }

  const results = []
  collectFiles(repoRoot, results)
  return results.filter(function (filePath) {
    const relativePath = normalizeRelative(filePath)
    return !baselineFiles.has(relativePath) && !ignoredFiles.has(relativePath)
  })
}

function findFirstIssue(filePath) {
  const source = fs.readFileSync(filePath, 'utf8')
  const lines = source.split(/\r?\n/)

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex]
    for (const matcher of suspiciousMatchers) {
      if (matcher.regex.test(line)) {
        return {
          file: normalizeRelative(filePath),
          line: lineIndex + 1,
          label: matcher.label,
          excerpt: line.trim().slice(0, 180)
        }
      }
    }
  }

  return null
}

const issues = []
for (const target of getScanTargets()) {
  const issue = findFirstIssue(target)
  if (issue) issues.push(issue)
}

if (issues.length) {
  console.error('Mojibake check failed. Suspicious text found in:')
  for (const issue of issues) {
    console.error('- ' + issue.file + ':' + issue.line + ' [' + issue.label + '] ' + issue.excerpt)
  }
  console.error('Fix the file encoding or text before committing.')
  process.exit(1)
}

console.log('Mojibake check passed.')