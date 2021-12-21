#!/usr/bin/env node
import cac from 'cac'
import { checkNodeVersion } from '../shared/check-data'
import { readJSONSync } from '../shared/read-file'

const pkgData = readJSONSync(new URL('../../package.json', import.meta.url))
const cliName = `${pkgData.name}`
const cli = cac(cliName)

// 检验Node版本
checkNodeVersion(pkgData.engines.node, cliName)

cli
  .command('serve', 'Start dev server', { allowUnknownOptions: true })
  .option('-p, --presets', 'Add presets to enhance configuration')
  .option(`-w, --watch`, 'Turn on listening mode default is true')
  .action(options => {
    console.log(options)
  })

cli.help()

cli.parse()
