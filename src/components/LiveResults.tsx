import { ExternalLink, RefreshCw, Store } from 'lucide-react'
import type { LiveSearchResult } from '../services/liveSearch'

const money = (value: number, currency: 'USD' | 'BRL') => new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)

export function LiveResults({ result }: { result: LiveSearchResult }) {
  if (!result.product) return <div className="empty">Nenhum perfume encontrado no Compras no Paraguai.</div>
  return <section className="live-results" aria-live="polite">
    <div className="live-heading">
      <div><span className="live-badge"><span /> DADOS AO VIVO</span><h2>{result.product.name}</h2><p>{result.product.volumeMl ? `${result.product.volumeMl} ml · ` : ''}{result.offers.length} fornecedores encontrados</p></div>
      <div className="live-updated"><RefreshCw size={14}/><span>Atualizado em<br/><strong>{new Date(result.updatedAt).toLocaleString('pt-BR')}</strong></span></div>
    </div>
    <div className="supplier-grid">
      {result.offers.map((offer) => <article className="supplier-card" key={offer.id}>
        <div className="supplier-name"><Store size={15}/><strong>{offer.supplier}</strong></div>
        <small>{offer.productName}</small>
        <div className="supplier-price"><strong>{money(offer.priceUsd, 'USD')}</strong><span>≈ {money(offer.priceBrl, 'BRL')}</span></div>
        <div className="supplier-links"><a href={offer.comparisonUrl} target="_blank" rel="noreferrer">Comparador <ExternalLink size={12}/></a><a href={offer.sourceUrl} target="_blank" rel="noreferrer">Loja <ExternalLink size={12}/></a></div>
      </article>)}
    </div>
    {result.alternatives.length > 0 && <div className="alternatives"><strong>Outros resultados:</strong>{result.alternatives.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noreferrer">{item.name}</a>)}</div>}
  </section>
}
