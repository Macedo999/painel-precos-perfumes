export interface LiveOffer {
  id: string; productName: string; volumeMl: number | null; supplier: string
  priceUsd: number; priceBrl: number; sourceUrl: string; comparisonUrl: string
}

export interface LiveSearchResult {
  query: string
  product: { name: string; volumeMl: number | null; url: string; priceUsd: number; priceBrl: number } | null
  alternatives: Array<{ name: string; volumeMl: number | null; url: string; priceUsd: number; priceBrl: number }>
  offers: LiveOffer[]
  updatedAt: string
}

const API_URL = (
  import.meta.env.VITE_API_URL || 'https://perfume-price-api.mecanflavio.workers.dev'
).replace(/\/$/, '')
export const isLiveSearchConfigured = () => Boolean(API_URL)

export async function searchComprasParaguai(query: string) {
  if (!API_URL) throw new Error('A consulta ao vivo ainda não foi configurada')
  const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`)
  const result = await response.json() as LiveSearchResult & { error?: string }
  if (!response.ok) throw new Error(result.error || 'Não foi possível consultar o Compras no Paraguai')
  return result
}
