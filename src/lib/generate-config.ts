import type { BuildOptions } from 'esbuild'
import glob from 'glob'
import path from 'path'
import type { CliCustomOptions, NormalizedArg, CliOptions } from '../types'

/**
 * 序列化cli参数，删除掉cli定义的参数之后就是esbuild需要的参数
 *
 * @param command cli命令
 * @param args cli原有的参数
 * @returns 执行不同逻辑的参数
 */
export async function normalizeCliArgs(command: 'serve' | 'build', args: CliOptions): Promise<NormalizedArg> {
  const normalizedConfig = {
    ...args
  } as any

  const haveWatch = Array.isArray(args.watch)
  const watch = haveWatch ? true : command === 'serve'
  const dts = typeof args.dts === 'boolean' ? args.dts : command === 'build'

  // 禁用esbuild的watch模式
  if (haveWatch) delete normalizedConfig.watch
  // 指定entryPoints
  if (Array.isArray(args.entrys) && args.entrys.length > 0) {
    const loadFilePromises = args.entrys.map(
      filePath =>
        new Promise((resolve, reject) => {
          glob(path.resolve(process.cwd(), filePath), { nodir: true }, (error, files) => {
            if (error) reject(error)
            resolve(files)
          })
        })
    )

    const matchResult = (await Promise.all(loadFilePromises)) as Array<string>
    const entryPoints = matchResult.reduce((preResult, itemResult) => {
      preResult = [...preResult, ...itemResult]
      return preResult
    }, [] as Array<string>)

    delete normalizedConfig.entrys
    normalizedConfig.entryPoints = entryPoints
  }

  // 删除cli自带的数据
  // eslint-disable-next-line no-underscore-dangle
  delete normalizedConfig['--']
  delete normalizedConfig.dts

  // 根据预设生成配置
  const presets = (
    Array.isArray(args.presets) && args.presets.length > 0 ? args.presets : ['node']
  ) as CliCustomOptions['presets']
  delete normalizedConfig.presets
  const configByPresets = generateConfigByPresets(presets)
  const config = combineConfig(configByPresets, normalizedConfig)
  return {
    config,
    watch,
    dts
  }
}

/**
 * 根据预设生成对应的配置
 *
 * @param presets 预设合集
 * @returns esbuild配置
 */
export function generateConfigByPresets(presets: CliCustomOptions['presets']): Array<BuildOptions> {
  // TODO: 存在多种预设的情况，后面的配置会覆盖前面预设的配置
  const config =
    presets?.reduce((preConfig, preset) => {
      if (preset === 'node') {
        preConfig = {
          ...preConfig,
          platform: 'node',
          target: 'node12',
          outdir: 'dist'
        }
      }
      return preConfig
    }, {} as BuildOptions) || {}

  // node输出多种格式
  if (presets?.includes('node')) {
    return [
      {
        ...config,
        entryNames: 'esm/[dir]/[name]',
        format: 'esm',
        outExtension: {
          '.js': '.mjs'
        }
      },
      {
        ...config,
        entryNames: 'cjs/[dir]/[name]',
        format: 'cjs',
        outExtension: {
          '.js': '.cjs'
        }
      }
    ]
  }
  return [config]
}

/**
 * 将预设生成的配置以及cli传递的配置合并
 *
 * @param configByPresets 根据预设生成的配置
 * @param normalizedConfig cli配置
 */
function combineConfig(
  configByPresets: Array<BuildOptions>,
  normalizedConfig: BuildOptions
): Array<BuildOptions> {
  // TODO: 命令行传递的配置优先级 > 预设生成的配置优先级
  return configByPresets.map(config => ({ ...config, ...normalizedConfig }))
}
