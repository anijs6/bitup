import semver from 'semver'

/**
 * 检验Node版本
 *
 * @param requiredVersion 依赖的Node版本
 * @param id 模块表示
 */
export function checkNodeVersion(requiredVersion: string, id: string): void {
  if (!semver.satisfies(process.version, requiredVersion)) {
    console.error(
      `You are using Node ${process.version}, but this version of ${id} requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
    )
    process.exit(1)
  }
}
