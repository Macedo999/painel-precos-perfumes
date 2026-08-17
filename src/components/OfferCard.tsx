import { ExternalLink, Store } from 'lucide-react'
import type { Comparison } from '../types'
import { calculateDifference } from '../services/matching'

const money = (value: number, currency: string) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency, maximumFractionDigits: currency === 'PYG' ? 0 : 2 }).format(value)

export function OfferCard({ comparison }: { comparison: Comparison }) {
  const { source, marketplace } = comparison
  return (
    <article className="offer-card">
      <div className="product-head">
        <div className="bottle" aria-hidden="true"><span /></div>
        <div>
          <span className="eyebrow">{source.supplier}</span>
          <h2>{source.productName}</h2>
          <div className="tags"><span>{source.volumeMl} ml</span><span>mesmo volume verificado</span></div>
        </div>
        <div className="source-price">
          <small>Compras no Paraguai</small>
          <strong>{money(source.price, source.currency)}</strong>
          {source.priceBrl && <span>≈ {money(source.priceBrl, 'BRL')}</span>}
          <a href={source.url} target="_blank" rel="noreferrer">Ver origem <ExternalLink size={13} /></a>
        </div>
      </div>
      <div className="market-list">
        <div className="list-label"><Store size={15} /> Mercado Livre <span>{marketplace.length} anúncios compatíveis</span></div>
        {marketplace.map((offer, index) => {
          const difference = calculateDifference(source.priceBrl ?? 0, offer.priceBrl ?? offer.price)
          return <div className="market-row" key={offer.id}>
            <span className="rank">{String(index + 1).padStart(2, '0')}</span>
            <div className="seller"><strong>{offer.supplier}</strong><small>{offer.productName}</small></div>
            <strong className="market-price">{money(offer.price, 'BRL')}</strong>
            <div className="saving"><strong>+ {money(difference.amount, 'BRL')}</strong><small>{difference.percent.toFixed(1)}% mais caro</small></div>
            <a className="icon-link" href={offer.url} target="_blank" rel="noreferrer" aria-label={`Abrir anúncio de ${offer.supplier}`}><ExternalLink size={16} /></a>
          </div>
        })}
      </div>
    </article>
  )
}
