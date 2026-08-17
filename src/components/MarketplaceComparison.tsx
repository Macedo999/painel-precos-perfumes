import { ExternalLink, Link2, ShoppingBag, TrendingUp } from 'lucide-react'
import type { LiveOffer, MarketplaceProvider } from '../services/liveSearch'

const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
const signedMoney = (value: number) => `${value >= 0 ? '+' : '−'} ${money(Math.abs(value))}`

function ProviderNotice({ provider }: { provider: MarketplaceProvider }) {
  if (provider.status === 'needs_auth') return <div className="marketplace-notice"><div><strong>Conecte sua conta do Mercado Livre</strong><span>A autorização permite consultar anúncios pela integração oficial.</span></div><a className="marketplace-primary" href="/api/mercadolivre-start"><Link2 size={14}/> Conectar Mercado Livre</a></div>
  if (provider.status === 'needs_configuration') return <div className="marketplace-notice"><div><strong>{provider.marketplace} ainda precisa ser configurado</strong><span>{provider.marketplace === 'Shopee' ? 'Aguardando a liberação da integração oficial da Shopee.' : 'Adicione o identificador e a chave da aplicação na Vercel.'}</span></div><a href={provider.searchUrl} target="_blank" rel="noreferrer">Pesquisar manualmente <ExternalLink size={13}/></a></div>
  return <div className="marketplace-notice"><div><strong>Consulta temporariamente indisponível</strong><span>Os preços do Compras no Paraguai continuam disponíveis normalmente.</span></div><a href={provider.searchUrl} target="_blank" rel="noreferrer">Abrir {provider.marketplace} <ExternalLink size={13}/></a></div>
}

export function MarketplaceComparison({ providers, sourceOffers }: { providers: MarketplaceProvider[]; sourceOffers: LiveOffer[] }) {
  const reference = sourceOffers.reduce<LiveOffer | null>((lowest, offer) => !lowest || offer.priceBrl < lowest.priceBrl ? offer : lowest, null)
  if (!reference || providers.length === 0) return null
  return <section className="marketplace-comparison">
    <div className="marketplace-heading">
      <div><span className="marketplace-kicker">COMPARATIVO NO BRASIL</span><h3>Quanto custa fora do Paraguai?</h3><p>Somente anúncios com o mesmo modelo e volume. Diferenças calculadas contra a menor oferta no Paraguai: <strong>{reference.supplier} · {money(reference.priceBrl)}</strong>.</p></div>
    </div>
    {providers.map((provider) => {
      if (provider.status !== 'ready') return <div className="marketplace-provider" key={provider.marketplace}><div className="marketplace-provider-title"><ShoppingBag size={17}/><strong>{provider.marketplace}</strong></div><ProviderNotice provider={provider}/></div>
      if (provider.offers.length === 0) return <div className="marketplace-provider" key={provider.marketplace}><div className="marketplace-provider-title"><ShoppingBag size={17}/><strong>{provider.marketplace}</strong><span>nenhum anúncio equivalente confirmado</span></div><div className="marketplace-notice"><div><strong>Nenhum resultado seguro</strong><span>Resultados com versão ou volume diferente foram descartados.</span></div><a href={provider.searchUrl} target="_blank" rel="noreferrer">Pesquisar manualmente <ExternalLink size={13}/></a></div></div>
      const prices = provider.offers.map((offer) => offer.priceBrl)
      const lowest = Math.min(...prices)
      const highest = Math.max(...prices)
      return <div className="marketplace-provider" key={provider.marketplace}>
        <div className="marketplace-provider-title"><ShoppingBag size={17}/><strong>{provider.marketplace}</strong><span>{provider.offers.length} anúncios equivalentes · faixa de {money(lowest)} a {money(highest)}</span><b><TrendingUp size={13}/> variação de {money(highest - lowest)}</b></div>
        <div className="marketplace-grid">{provider.offers.map((offer) => {
          const difference = offer.priceBrl - reference.priceBrl
          const percentage = (difference / reference.priceBrl) * 100
          return <article className="marketplace-card" key={offer.id}>
            <div className="marketplace-card-top"><strong>{offer.seller}</strong><span>{offer.volumeMl} ml</span></div>
            <p>{offer.title}</p>
            <div className="marketplace-price"><strong>{money(offer.priceBrl)}</strong>{offer.originalPriceBrl && offer.originalPriceBrl > offer.priceBrl ? <del>{money(offer.originalPriceBrl)}</del> : null}</div>
            <div className={`marketplace-difference ${difference >= 0 ? 'higher' : 'lower'}`}><strong>{signedMoney(difference)}</strong><span>{Math.abs(percentage).toFixed(1)}% {difference >= 0 ? 'mais caro' : 'mais barato'}</span></div>
            <a href={offer.url} target="_blank" rel="noreferrer">Ver anúncio <ExternalLink size={13}/></a>
          </article>
        })}</div>
      </div>
    })}
  </section>
}
