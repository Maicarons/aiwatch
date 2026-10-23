import ko from '../locales/ko'
import en from '../locales/en'
import zh from '../locales/zh'

const LOCALES = { ko, en, zh }

// Native labels for the language picker, in VALID_LANGS order.
export const LANG_LABELS = { ko: '한국어', en: 'English', zh: '中文' }

// BCP-47 locale used for Intl date/number formatting. Falls back to en-US so an
// unknown value still renders instead of throwing.
const INTL_LOCALES = { ko: 'ko-KR', en: 'en-US', zh: 'zh-CN' }

export function intlLocale(lang) {
  return INTL_LOCALES[lang] ?? 'en-US'
}

export function t(key, lang) {
  if (LOCALES[lang] === undefined) {
    console.error(`[t] Unknown locale "${lang}" for key "${key}"`)
  }

  const inLocale = LOCALES[lang]?.[key]
  if (inLocale !== undefined) return inLocale

  // English is the fallback for every non-English locale: a missing zh/ko key
  // should read as English rather than as another language's prose.
  const inEn = LOCALES['en']?.[key]
  if (inEn !== undefined) {
    if (lang !== 'en') {
      console.warn(`[t] Missing translation for "${key}" in locale "${lang}". Using "en" fallback.`)
    }
    return inEn
  }

  const inKo = LOCALES['ko']?.[key]
  if (inKo !== undefined) {
    console.warn(`[t] Missing English translation for "${key}". Using "ko" fallback.`)
    return inKo
  }

  console.error(`[t] Missing translation key "${key}" in all locales.`)
  return key
}
