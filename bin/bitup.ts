#!/usr/bin/env node
import cac from 'cac'
import { checkNodeVersion } from '../shared/check-data'
import { readJSONSync } from '../shared/read-file'

const pkgData = readJSONSync(new URL('../package.json', import.meta.url))
const cliName = `${pkgData.name}-cli`
const cli = cac(cliName)

// 检验Node版本
checkNodeVersion(pkgData.engines.node, cliName)

cli
  .option(``)
  .option(``)
  .option(``)
  .option(``)
  .option(``)
  .option(``)
  .option(``)
  .option(``)
  .option(``)
  .option(``)
  .option(``)

const parseData = cli.parse()
