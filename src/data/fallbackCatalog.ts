import type { LiveSearchResult } from '../services/liveSearch'

const updatedAt = '2026-08-17T14:45:00-03:00'
const makeOffers = (key: string, name: string, volumeMl: number, url: string, rows: Array<[string, number, number]>) => rows.map(([supplier, priceUsd, priceBrl], index) => ({ id: `${key}-${index}`, productName: name, volumeMl, supplier, priceUsd, priceBrl, sourceUrl: url, comparisonUrl: url }))

export const fallbackCatalog: LiveSearchResult[] = [
  {
    query: '212 vip feminino 80ml', updatedAt,
    product: { name: 'Perfume Carolina Herrera 212 VIP Eau de Parfum Feminino 80ML', volumeMl: 80, url: 'https://www.comprasparaguai.com.br/perfume-carolina-herrera-212-vip-eau-de-parfum-feminino-80ml_3140/', priceUsd: 65, priceBrl: 338 }, alternatives: [],
    offers: makeOffers('212-vip-f-80', 'Carolina Herrera 212 VIP EDP Feminino 80ML', 80, 'https://www.comprasparaguai.com.br/perfume-carolina-herrera-212-vip-eau-de-parfum-feminino-80ml_3140/', [['MultiPass', 68.5, 356.2], ['Cellshop', 72, 374.4], ['Matrix Importados', 88, 457.6], ['Prime Shop', 80, 416]])
  },
  {
    query: '212 feminino 60ml', updatedAt,
    product: { name: 'Perfume Carolina Herrera 212 Eau de Toilette Feminino 60ML', volumeMl: 60, url: 'https://www.comprasparaguai.com.br/perfume-carolina-herrera-212-eau-de-toilette-feminino-60ml_798/', priceUsd: 49.5, priceBrl: 257.4 }, alternatives: [],
    offers: makeOffers('212-f-60', 'Carolina Herrera 212 NYC EDT Feminino 60ML', 60, 'https://www.comprasparaguai.com.br/perfume-carolina-herrera-212-eau-de-toilette-feminino-60ml_798/', [['Shopping China', 62, 322.4], ['Cellshop', 60, 312], ['New Zone', 60, 312], ['La Petisquera', 54, 280.8], ['Macedonia', 49.5, 257.4]])
  }
]

export const fallbackMatches = (query: string) => {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  return fallbackCatalog.filter((item) => terms.every((term) => item.product?.name.toLowerCase().includes(term)))
}
