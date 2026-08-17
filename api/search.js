const COLLECTOR = 'https://perfume-price-api.mecanflavio.workers.dev'

export default async function handler(request, response) {
  const query = String(request.query.q || '').trim().slice(0, 80)
  if (query.length < 2) return response.status(400).json({ error: 'Informe pelo menos 2 caracteres' })
  try {
    const upstream = await fetch(`${COLLECTOR}/search?q=${encodeURIComponent(query)}`, { signal: AbortSignal.timeout(20000) })
    const result = await upstream.json()
    if (!upstream.ok) throw new Error(result.error || `Coletor respondeu ${upstream.status}`)
    const products = [result.product, ...(result.alternatives || [])].filter((item, index, values) => item && values.findIndex((candidate) => candidate?.url === item.url) === index)
    response.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600')
    return response.json({ query, products, updatedAt: result.updatedAt })
  } catch (error) {
    return response.status(502).json({ error: 'Não foi possível consultar o Compras no Paraguai', detail: String(error) })
  }
}
