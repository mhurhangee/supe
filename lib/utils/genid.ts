import { nanoid } from 'nanoid'

export function genId(length: number = 12) {
  return nanoid(length)
}
