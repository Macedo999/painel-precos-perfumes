export type Currency = 'PYG' | 'USD' | 'BRL'

export interface SourceOffer {
  id: string
  productName: string
  canonicalName: string
  volumeMl: number
  supplier: string
  price: number
  currency: Currency
  priceBrl?: number
  url: string
  updatedAt: string
}

export interface Comparison {
  source: SourceOffer
  marketplace: SourceOffer[]
}
