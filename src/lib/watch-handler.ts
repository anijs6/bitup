import chokidar from 'chokidar'

export function watchFiles(files: Array<string>): Promise<void> {
  const watcher = chokidar.watch(files)

  return new Promise(resolve => {
    watcher.on('add', resolve).on('change', resolve)
  })
}
