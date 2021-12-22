#!/usr/bin/env node
import cac from 'cac'
import { checkNodeVersion } from '../shared/check-data'
import { readJSONSync } from '../shared/read-file'
import { normalizeCliArgs, generateConfigByPresets } from '../lib/generate-config'

const pkgData = readJSONSync(new URL('../../package.json', import.meta.url))
const cliName = `${pkgData.name}`
const cli = cac(cliName)

// 检验Node版本
checkNodeVersion(pkgData.engines.node, cliName)

cli
  .command('serve', 'Start dev server', { allowUnknownOptions: true })
  .option('-p, --presets', 'Add presets to enhance configuration', {
    type: [String],
    default: ['node']
  })
  .option(`-w, --watch`, 'Turn on listening mode default is true', { default: true })
  .option(`--dts`, 'Whether to generate a type declaration .dts files', { default: false })
  .option(`-e, --entrys`, 'Specify the files to be compiled, support glob mode', {
    type: [String],
    default: ['src/**']
  })
  .action(options => {
    const newOptions = normalizeCliArgs('serve', options)
    console.log(newOptions)
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
