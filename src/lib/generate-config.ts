import type { BuildOptions } from 'esbuild'
import glob from 'glob'
import path from 'path'
import type { CliCustomOptions, NormalizedArg } from '../types'

/**
 * 序列化cli参数
 *
 * @param command cli命令
 * @param args cli原有的参数
 * @returns 执行不同逻辑的参数
 */
export async function normalizeCliArgs(
  command: 'serve' | 'build',
  args: { [key: string]: any }
): Promise<NormalizedArg> {
  const config = {
    ...args
  }

  const haveWatch = typeof args.watch === 'boolean'
  const watch = haveWatch ? args.watch : command === 'serve'
  const dts = typeof args.dts === 'boolean' ? args.dts : command === 'build'

  // 禁用esbuild的watch模式
  if (haveWatch) delete config.watch
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

    delete config.entrys
    config.entryPoints = entryPoints
  }

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
          format: 'esm',
          target: 'node12'
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
        target: 'node12'
      },
      {
        ...config,
        entryNames: 'cjs/[dir]/[name]',
        format: 'cjs',
        target: 'node10'
      }
    ]
  }
  return [config]
}
