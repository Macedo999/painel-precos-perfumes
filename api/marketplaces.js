import { configured, refreshAccessToken, validAccessToken } from './lib/mercadolivre.js'

const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const VARIANTS = ['rose', 'black', 'sexy', 'heroes', 'hero', 'elixir', 'limited', 'intense', 'absolu']
const STOPWORDS = new Set(['perfume', 'eau', 'de', 'do', 'da', 'parfum', 'toilette', 'edp', 'edt', 'feminino', 'masculino', 'ml'])

function volumeOf(item) {
  const fromTitle = normalize(item.title).match(/(?:^|\s)(\d{1,4})\s*ml(?:\s|$)/)?.[1]
  if (fromTitle) return Number(fromTitle)
  const attribute = (item.attributes || []).find((entry) => /volume|capacidade/i.test(`${entry.id} ${entry.name}`))
  return Number(String(attribute?.value_name || '').match(/\d{1,4}/)?.[0]) || null
}

export function equivalent(referenceName, referenceVolume, candidate) {
  const reference = normalize(referenceName)
  const title = normalize(candidate.title)
  const volume = volumeOf(candidate)
  if (referenceVolume && volume !== referenceVolume) return false
  for (const variant of VARIANTS) {
    if (reference.includes(variant) !== title.includes(variant)) return false
  }
  if (reference.includes(' vip ') && !title.includes(' vip ')) return false
  const tokens = reference.split(' ').filter((token) => token.length > 1 && !STOPWORDS.has(token) && !/^\d+$/.test(token))
  const matched = tokens.filter((token) => title.includes(token)).length
  return matched >= Math.max(2, Math.ceil(tokens.length * 0.55))
}

function marketplaceUrl(name, marketplace) {
  if (marketplace === 'mercadolivre') return `https://lista.mercadolivre.com.br/${normalize(name).replace(/\s+/g, '-')}`
  return `https://shopee.com.br/search?keyword=${encodeURIComponent(name)}`
}

async function fetchMercadoLivre(name, volumeMl, token) {
  const endpoint = new URL('https://api.mercadolibre.com/sites/MLB/search')
  endpoint.searchParams.set('q', name.replace(/^Perfume\s+/i, ''))
  endpoint.searchParams.set('limit', '50')
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
    signal: AbortSignal.timeout(18000),
  })
  if (response.status === 401) return { unauthorized: true, offers: [] }
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || `Mercado Livre respondeu ${response.status}`)
  const seen = new Set()
  const offers = (result.results || []).filter((item) => equivalent(name, volumeMl, item)).filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id); return true
  }).map((item) => ({
    id: item.id,
    marketplace: 'Mercado Livre',
    title: item.title,
    seller: item.seller?.nickname || item.official_store_name || `Anunciante ${item.seller?.id || ''}`.trim(),
    priceBrl: Number(item.price),
    originalPriceBrl: Number(item.original_price) || null,
    volumeMl: volumeOf(item),
    url: item.permalink || `https://produto.mercadolivre.com.br/${item.id}`,
  })).filter((item) => item.priceBrl > 0).sort((a, b) => a.priceBrl - b.priceBrl).slice(0, 6)
  return { unauthorized: false, offers }
}

export default async function handler(request, response) {
  const name = String(request.query.name || '').trim().slice(0, 160)
  const volumeMl = Number(request.query.volumeMl) || null
  if (name.length < 2) return response.status(400).json({ error: 'Produto inválido' })
  response.setHeader('Cache-Control', 'private, no-store')
  const shopee = { marketplace: 'Shopee', status: 'needs_configuration', offers: [], searchUrl: marketplaceUrl(name, 'shopee') }
  if (!configured()) return response.json({ providers: [{ marketplace: 'Mercado Livre', status: 'needs_configuration', offers: [], searchUrl: marketplaceUrl(name, 'mercadolivre') }, shopee] })
  try {
    let token = await validAccessToken(request, response)
    if (!token) return response.json({ providers: [{ marketplace: 'Mercado Livre', status: 'needs_auth', offers: [], searchUrl: marketplaceUrl(name, 'mercadolivre') }, shopee] })
    let result = await fetchMercadoLivre(name, volumeMl, token)
    if (result.unauthorized) {
      token = await refreshAccessToken(request, response)
      if (!token) return response.json({ providers: [{ marketplace: 'Mercado Livre', status: 'needs_auth', offers: [], searchUrl: marketplaceUrl(name, 'mercadolivre') }, shopee] })
      result = await fetchMercadoLivre(name, volumeMl, token)
    }
    return response.json({ providers: [{ marketplace: 'Mercado Livre', status: 'ready', offers: result.offers, searchUrl: marketplaceUrl(name, 'mercadolivre') }, shopee] })
  } catch (error) {
    return response.status(502).json({ error: 'Não foi possível consultar o Mercado Livre', detail: String(error) })
  }
}
