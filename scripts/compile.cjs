const esbuild = require('esbuild')
const pkg = require('../package.json')

const external = Object.keys(pkg.dependencies).map(item => item)

esbuild
  .build({
    entryPoints: ['src/bin/bitup.ts'],
    outExtension: {
      '.js': '.mjs'
    },
    bundle: true,
    platform: 'node',
    target: 'node12',
    mainFields: ['module', 'main'],
    external,
    outdir: 'dist',
    outbase: 'src',
    format: 'esm'
  })
  .then(() => {
    console.log('编译完成')
  })
  .catch(console.log)
