import esbuid from 'esbuild'
import type { BuildOptions } from 'esbuild'

export async function build(configs: Array<BuildOptions>) {
  await Promise.all(configs.map(config => esbuid.build(config)))
  const now = new Date()
  console.log(`构建完成：${now.getHours()}:${now.getMinutes()}`)
}
