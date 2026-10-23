// #1697 — the dashboard's sentence for a service's past recovery times (`recoveryBaseline[svcId]` on
// /api/status and /api/status/cached). The EN wording matches worker/src/recovery-baseline-text.ts.
import { fmtMin } from './predictionAccuracy'
import { t } from './lang'

export function recoveryBaselineText(b, lang) {
  if (!b) return null
  return t('analysis.recovery.baseline', lang)
    .replace('{median}', fmtMin(b.medianMin))
    .replace('{p80}', fmtMin(b.p80Min))
    .replace('{n}', String(b.n))
    .replace('{since}', String(b.since))
}
