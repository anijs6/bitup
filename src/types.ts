import type { BuildOptions } from 'esbuild'

const Presets = {
  node: true,
  react: true
}

export interface NormalizedArg {
  /**
   * 是否开启监听模式
   */
  watch: boolean
  /**
   * esbuild配置
   */
  config: BuildOptions
  /**
   * 是否生成类型申明文件
   */
  dts: boolean
}

export interface CliCustomOptions {
  presets?: Array<keyof typeof Presets>
}

export type GenerateConfigOptions = BuildOptions & CliCustomOptions
