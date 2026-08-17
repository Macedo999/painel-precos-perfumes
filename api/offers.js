const COLLECTOR = 'https://perfume-price-api.mecanflavio.workers.dev'

export default async function handler(request, response) {
  const name = String(request.query.name || '').trim().slice(0, 160)
  const url = String(request.query.url || '').trim().slice(0, 500)
  if (name.length < 2) return response.status(400).json({ error: 'Produto inválido' })
  try {
    // Include the product id in the upstream query so variants with similar
    // names never share a stale collector cache entry (VIP vs. VIP Rosé, etc.).
    const productId = url.match(/_(\d+)\/?$/)?.[1] || 'selected'
    const exactQuery = `[${productId}] ${name}`
    const upstream = await fetch(`${COLLECTOR}/search?q=${encodeURIComponent(exactQuery)}&url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(20000) })
    const result = await upstream.json()
    if (!upstream.ok) throw new Error(result.error || `Coletor respondeu ${upstream.status}`)
    response.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600')
    return response.json({
      product: { ...result.product, name, url: url || result.product?.url },
      offers: result.offers || [],
      updatedAt: result.updatedAt,
    })
  } catch (error) {
    return response.status(502).json({ error: 'Não foi possível consultar as ofertas', detail: String(error) })
  }
}
