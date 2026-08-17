import type { SourceOffer } from '../types'

export function normalizeName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\b(eau de parfum|eau de toilette|edp|edt|perfume|feminino|masculino)\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function isEquivalent(source: SourceOffer, candidate: SourceOffer) {
  if (source.volumeMl !== candidate.volumeMl) return false
  const a = normalizeName(source.canonicalName || source.productName)
  const b = normalizeName(candidate.canonicalName || candidate.productName)
  return a === b || a.includes(b) || b.includes(a)
}

export function matchOffers(source: SourceOffer, offers: SourceOffer[]) {
  return offers.filter((offer) => isEquivalent(source, offer))
}

export function calculateDifference(sourcePriceBrl: number, marketPriceBrl: number) {
  const amount = marketPriceBrl - sourcePriceBrl
  return { amount, percent: (amount / sourcePriceBrl) * 100 }
}
