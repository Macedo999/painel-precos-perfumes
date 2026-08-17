import type { SourceOffer } from '../types'

export interface OfferProvider {
  getOffers(): Promise<SourceOffer[]>
}

/**
 * Ponto de extensão para uma API/backend próprio que consulte a API oficial do
 * Mercado Livre. Tokens devem permanecer no servidor, nunca no navegador.
 */
export class MercadoLivreProvider implements OfferProvider {
  constructor(private readonly endpoint: string) {}
  async getOffers(): Promise<SourceOffer[]> {
    const response = await fetch(this.endpoint)
    if (!response.ok) throw new Error('Não foi possível consultar o Mercado Livre')
    return response.json() as Promise<SourceOffer[]>
  }
}

/**
 * Contrato para um coletor autorizado do Compras no Paraguai. A implementação
 * futura deve observar robots.txt/termos, cache, intervalos e limites de acesso.
 */
export class ComprasNoParaguaiProvider implements OfferProvider {
  constructor(private readonly endpoint: string) {}
  async getOffers(): Promise<SourceOffer[]> {
    const response = await fetch(this.endpoint)
    if (!response.ok) throw new Error('Não foi possível consultar o coletor')
    return response.json() as Promise<SourceOffer[]>
  }
}
