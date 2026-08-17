export interface ProductSuggestion { name: string; url: string; volumeMl: number | null; priceUsd: number; priceBrl: number }
export interface LiveOffer { id: string; productName: string; volumeMl: number | null; supplier: string; priceUsd: number; priceBrl: number; sourceUrl: string; comparisonUrl: string }
export interface MarketplaceOffer { id: string; marketplace: string; title: string; seller: string; priceBrl: number; originalPriceBrl: number | null; volumeMl: number | null; url: string }
export interface MarketplaceProvider { marketplace: string; status: 'ready' | 'needs_auth' | 'needs_configuration' | 'error'; offers: MarketplaceOffer[]; searchUrl: string }
export interface LiveSearchResult { query: string; product: ProductSuggestion | null; alternatives: ProductSuggestion[]; offers: LiveOffer[]; marketplaces: MarketplaceProvider[]; updatedAt: string }

async function json<T>(response: Response): Promise<T> {
  const result = await response.json() as T & { error?: string }
  if (!response.ok) throw new Error(result.error || 'Falha na consulta')
  return result
}

export async function searchProducts(query: string, signal?: AbortSignal) {
  return json<{ query: string; products: ProductSuggestion[]; updatedAt: string }>(await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal }))
}

export async function loadOffers(product: ProductSuggestion) {
  const offersRequest = fetch(`/api/offers?name=${encodeURIComponent(product.name)}&url=${encodeURIComponent(product.url)}`)
  const marketplaceRequest = json<{ providers: MarketplaceProvider[] }>(await fetch(`/api/marketplaces?name=${encodeURIComponent(product.name)}&volumeMl=${product.volumeMl || ''}`)).catch(() => ({
    providers: [{ marketplace: 'Mercado Livre', status: 'error' as const, offers: [], searchUrl: `https://lista.mercadolivre.com.br/${encodeURIComponent(product.name)}` }],
  }))
  const [result, marketplaceResult] = await Promise.all([
    json<{ product: Omit<ProductSuggestion, 'priceUsd' | 'priceBrl'>; offers: LiveOffer[]; updatedAt: string }>(await offersRequest),
    marketplaceRequest,
  ])
  return { query: product.name, product: { ...product, ...result.product }, alternatives: [], offers: result.offers, marketplaces: marketplaceResult.providers, updatedAt: result.updatedAt } satisfies LiveSearchResult
}
