import * as esbuild from 'esbuild'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const watch = process.argv.includes('--watch')

const scriptsDir = path.join(dirname, 'scripts')
const scriptEntryPoints = readdirSync(scriptsDir)
  .filter((f) => f.endsWith('.ts'))
  .map((f) => path.join(scriptsDir, f))

const sharedOptions = {
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  sourcemap: true,
  // Only our own source graph (which reaches outside api/ into ../src/domain and
  // ../src/services/logic) gets bundled — npm dependencies stay external so the
  // Functions host resolves them from node_modules as usual.
  packages: 'external',
  logLevel: 'info',
  // Some shared frontend files (e.g. src/data/seed/progressGenerator.ts, used only by
  // scripts/seed-demo-trainees.ts) import via Vite's "@/" -> "src/*" alias — mirror it
  // here so esbuild resolves those the same way instead of treating "@/..." as a bare
  // npm package specifier.
  alias: {
    '@': path.resolve(dirname, '../src'),
  },
}

const builds = [
  { ...sharedOptions, entryPoints: [path.join(dirname, 'src/index.ts')], outfile: path.join(dirname, 'dist/index.js') },
  { ...sharedOptions, entryPoints: scriptEntryPoints, outdir: path.join(dirname, 'dist/scripts') },
]

if (watch) {
  for (const options of builds) {
    const ctx = await esbuild.context(options)
    await ctx.watch()
  }
  console.log('esbuild watching for changes...')
} else {
  for (const options of builds) {
    await esbuild.build(options)
  }
}
