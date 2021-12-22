#!/usr/bin/env node
import cac from 'cac'
import { checkNodeVersion } from '../shared/check-data'
import { readJSONSync } from '../shared/read-file'
import { normalizeCliArgs } from '../lib/generate-config'
import { build } from '../lib/build'
import type { CliOptions } from '../types'

const pkgData = readJSONSync(new URL('../../package.json', import.meta.url))
const cliName = `${pkgData.name}`
const cli = cac(cliName)

// 检验Node版本
checkNodeVersion(pkgData.engines.node, cliName)

cli
  .command('serve', 'Start dev server', { allowUnknownOptions: true })
  .option('--presets <presets>', 'Add presets to enhance configuration', {
    type: [String],
    default: ['node']
  })
  .option(`--watch <dirs>`, 'Turn on listening mode default is true', {
    default: [process.cwd()],
    type: [String]
  })
  .option(`--dts`, 'Whether to generate a type declaration .dts files', { default: false })
  .option(`--entrys`, 'Specify the files to be compiled, support glob mode', {
    type: [String],
    default: ['src/**']
  })
  .action(async (options: CliOptions) => {
    const newOptions = await normalizeCliArgs('serve', options)
    console.log(newOptions.config)
    build(newOptions.config)
  })

cli
  .command('build', 'compile the library', { allowUnknownOptions: true })
  .option('-p, --presets', 'Add presets to enhance configuration')
  .option(`-w, --watch`, 'Turn on listening mode default is true', { default: false })
  .option(`--dts`, 'Whether to generate a type declaration .dts files', { default: true })
  .action(options => {
    console.log(options)
  })

cli.help()
cli.version(pkgData.version)

cli.parse()
