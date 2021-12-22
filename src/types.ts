import type { BuildOptions } from 'esbuild'

const Presets = {
  node: true,
  react: true
}

export interface NormalizedArg {
  /**
   * 监听目录
   */
  watch: Array<string>
  /**
   * esbuild配置
   */
  config: Array<BuildOptions>
  /**
   * 是否生成类型申明文件
   */
  dts: boolean
}

/**
 * cli默认携带的option
 */
export interface CliDefaultOptions {
  '--'?: Array<string>
}

/**
 * 定义的cli支持的所有option
 */
export interface CliCustomOptions {
  /**
   * 预设
   */
  presets?: Array<keyof typeof Presets>
  /**
   * 监听的目录
   */
  watch?: Array<string>
  /**
   * 是否生成类型声明文件
   */
  dts?: boolean
  /**
   * 指定入口文件列表
   */
  entrys?: Array<string>
}

export type CliOptions = CliDefaultOptions & CliCustomOptions

export type GenerateConfigOptions = BuildOptions & CliCustomOptions
