import { describe, it, expect } from 'vitest'
import en from '../en'
import ko from '../ko'
import zh from '../zh'

// #1268 — nothing checked that the locale maps carry the same keys. `t()` falls back to rendering
// the raw dot-key, so the failure mode is a Korean reader seeing `svc.sourceUnknown.bodyProbe` on the
// card — visible only to whoever opens that exact state in that exact language, which is how it would
// have shipped: this change added one key to each file by hand, and `lint:korean` checks token leaks
// and term drift, not parity.
//
// Deliberately symmetric. An en-only key is the common direction (write the English, forget the
// translation), but a ko-only or zh-only key is just as broken for other readers and costs nothing
// to cover.
const LOCALES = { en, ko, zh }

describe('locale parity (en ↔ ko ↔ zh)', () => {
  it('all maps define exactly the same keys', () => {
    const enKeys = Object.keys(en).sort()
    // Reported as the DIFFERENCES rather than a whole-map diff, so a failure names the missing
    // key instead of printing hundreds of lines.
    const diff = {}
    for (const [name, map] of Object.entries(LOCALES)) {
      if (name === 'en') continue
      diff[`missingIn${name[0].toUpperCase()}${name.slice(1)}`] = enKeys.filter((k) => !(k in map))
      diff[`missingInEnFrom${name[0].toUpperCase()}${name.slice(1)}`] = Object.keys(map).filter((k) => !(k in en))
    }
    expect(diff).toEqual({
      missingInKo: [], missingInEnFromKo: [],
      missingInZh: [], missingInEnFromZh: [],
    })
  })

  it('#1268 — the source-state keys ServiceDetails renders are present in EVERY locale', () => {
    // Parity alone cannot see this: deleting a key from every map is symmetric, so the test above
    // stays green while every reader gets the raw dot-key rendered on the card. The component test
    // cannot see it either — it mocks `t` to the identity, so its assertions name keys, not strings.
    for (const k of [
      'svc.sourceDead.title', 'svc.sourceDead.body', 'svc.sourceDead.bodyProbe',
      'svc.sourceUnknown.title', 'svc.sourceUnknown.body', 'svc.sourceUnknown.bodyProbe',
      'svc.sourceUnknown.bodyAffected',
    ]) {
      for (const [name, map] of Object.entries(LOCALES)) {
        expect(map[k], `${name} is missing ${k}`).toBeTruthy()
      }
    }
  })

  it('no key maps to an empty string in any locale', () => {
    // An empty value renders as nothing, which is worse than the raw key: a silently missing sentence.
    const blank = (m) => Object.entries(m).filter(([, v]) => typeof v === 'string' && v.trim() === '').map(([k]) => k)
    expect({ en: blank(en), ko: blank(ko), zh: blank(zh) }).toEqual({ en: [], ko: [], zh: [] })
  })
})
