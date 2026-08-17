import { useMemo, useState } from 'react'
import { Bell, ChevronDown, Clock3, Search, Sparkles, TrendingDown } from 'lucide-react'
import { OfferCard } from './components/OfferCard'
import { demoComparisons } from './data/demo'

export default function App() {
  const [query, setQuery] = useState('')
  const [supplier, setSupplier] = useState('Todos os fornecedores')
  const suppliers = [...new Set(demoComparisons.map(({ source }) => source.supplier))]
  const filtered = useMemo(() => demoComparisons.filter(({ source }) => {
    const text = `${source.productName} ${source.supplier}`.toLowerCase()
    return text.includes(query.toLowerCase()) && (supplier === 'Todos os fornecedores' || source.supplier === supplier)
  }), [query, supplier])
  const averageSaving = demoComparisons.flatMap((item) => item.marketplace.map((offer) => ((offer.priceBrl! - item.source.priceBrl!) / item.source.priceBrl!) * 100)).reduce((a, b) => a + b, 0) / demoComparisons.flatMap((x) => x.marketplace).length

  return <div className="app-shell">
    <header>
      <a className="brand" href="#top"><span><Sparkles size={20} /></span><div>PREÇO <strong>DE ESSÊNCIA</strong></div></a>
      <nav><a href="#ofertas">Ofertas</a><a href="#metodo">Como funciona</a></nav>
      <button className="alert-button"><Bell size={16} /> Criar alerta</button>
    </header>
    <main id="top">
      <section className="hero">
        <div><span className="kicker"><span /> INTELIGÊNCIA DE PREÇOS</span><h1>Seu perfume favorito,<br/><em>pelo preço certo.</em></h1><p>Comparamos ofertas do Paraguai com anúncios equivalentes no Brasil — sempre respeitando o mesmo produto e volume.</p></div>
        <div className="hero-stats"><div><small>ECONOMIA MÉDIA</small><strong>{averageSaving.toFixed(0)}<sup>%</sup></strong><span><TrendingDown size={14} /> nas ofertas monitoradas</span></div><div><small>ÚLTIMA ATUALIZAÇÃO</small><strong className="time">13:42</strong><span><Clock3 size={14} /> 17 ago 2026</span></div></div>
      </section>
      <section className="toolbar" id="ofertas">
        <div className="search"><Search size={18}/><input aria-label="Buscar perfume" placeholder="Busque por perfume ou fornecedor" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        <label className="select-wrap"><select aria-label="Filtrar fornecedor" value={supplier} onChange={(e) => setSupplier(e.target.value)}><option>Todos os fornecedores</option>{suppliers.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16}/></label>
        <span className="result-count">{filtered.length} ofertas encontradas</span>
      </section>
      <section className="offers">{filtered.map((comparison) => <OfferCard key={comparison.source.id} comparison={comparison} />)}{!filtered.length && <div className="empty">Nenhuma oferta encontrada para esta busca.</div>}</section>
      <section className="method" id="metodo"><span>COMPARAÇÃO SEGURA</span><h2>Mesmo perfume. Mesmo volume.</h2><p>O pareamento exige nome compatível e volume idêntico. Assim, um frasco de 50 ml nunca é comparado com um de 100 ml. Conversões são estimativas e podem variar.</p></section>
    </main>
    <footer><span>Dados demonstrativos para o MVP.</span><span>Atualizações em intervalos · sem garantia de tempo real</span></footer>
  </div>
}
