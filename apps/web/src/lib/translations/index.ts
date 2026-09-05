import type { Translations } from './en'
import { en } from './en'
import { id } from './id'
export type { Translations } from './en'
export { en }
export { id }
export const translations: Record<string, Translations> = { en, id }
