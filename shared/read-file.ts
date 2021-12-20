import { readFile } from 'fs/promises'
import { readFileSync } from 'fs'
import type { PathLike } from 'fs'

export async function readJSON(url: PathLike) {
  const json = JSON.parse(await readFile(url, { encoding: 'utf-8' }))
  return json
}

export function readJSONSync(url: PathLike) {
  const json = JSON.parse(readFileSync(url, { encoding: 'utf-8' }))
  return json
}
