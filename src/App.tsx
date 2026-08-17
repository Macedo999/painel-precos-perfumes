import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Bell, ChevronDown, Clock3, Search, Sparkles, TrendingDown } from 'lucide-react'
import { OfferCard } from './components/OfferCard'
import { LiveResults } from './components/LiveResults'
import { demoComparisons } from './data/demo'
import { loadOffers, searchProducts, type LiveSearchResult, type ProductSuggestion } from './services/liveSearch'

export default function App() {
  const mlStatus = new URLSearchParams(window.location.search).get('ml')
  const [query, setQuery] = useState('')
  const [supplier, setSupplier] = useState('Todos os fornecedores')
  const [liveResult, setLiveResult] = useState<LiveSearchResult | null>(null)
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [searchError, setSearchError] = useState('')
  const suppliers = [...new Set(demoComparisons.map(({ source }) => source.supplier))]
  const filtered = useMemo(() => demoComparisons.filter(({ source }) => {
    const text = `${source.productName} ${source.supplier}`.toLowerCase()
    return text.includes(query.toLowerCase()) && (supplier === 'Todos os fornecedores' || source.supplier === supplier)
  }), [query, supplier])
  const averageSaving = demoComparisons.flatMap((item) => item.marketplace.map((offer) => ((offer.priceBrl! - item.source.priceBrl!) / item.source.priceBrl!) * 100)).reduce((a, b) => a + b, 0) / demoComparisons.flatMap((x) => x.marketplace).length

  useEffect(() => {
    const term = query.trim()
    if (term.length < 2 || liveResult) { setSuggestions([]); return }
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setSuggesting(true); setSearchError('')
      try { setSuggestions((await searchProducts(term, controller.signal)).products) }
      catch (error) { if (!controller.signal.aborted) setSearchError(error instanceof Error ? error.message : 'Falha na consulta') }
      finally { if (!controller.signal.aborted) setSuggesting(false) }
    }, 350)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [query, liveResult])

  async function selectProduct(product: ProductSuggestion) {
    setQuery(product.name); setSuggestions([]); setLoading(true); setSearchError(''); setLiveResult(null)
    try { setLiveResult(await loadOffers(product)) }
    catch (error) { setSearchError(error instanceof Error ? error.message : 'Falha na consulta') }
    finally { setLoading(false) }
  }

  async function handleSearch(event: FormEvent) {
    event.preventDefault()
    const term = query.trim()
    if (term.length < 2) return
    if (suggestions[0]) return selectProduct(suggestions[0])
    setSuggesting(true); setSearchError('')
    try { setSuggestions((await searchProducts(term)).products) }
    catch (error) { setSearchError(error instanceof Error ? error.message : 'Falha na consulta') }
    finally { setSuggesting(false) }
  }

  return <div className="app-shell">
    <header><a className="brand" href="#top"><span><Sparkles size={20} /></span><div>PREÇO <strong>DE ESSÊNCIA</strong></div></a><nav><a href="#ofertas">Ofertas</a><a href="#metodo">Como funciona</a></nav><button className="alert-button"><Bell size={16} /> Criar alerta</button></header>
    <main id="top">
      <section className="hero"><div><span className="kicker"><span /> INTELIGÊNCIA DE PREÇOS</span><h1>Seu perfume favorito,<br/><em>pelo preço certo.</em></h1><p>Digite qualquer perfume. Primeiro escolha o modelo e o volume; depois veja os preços separados por fornecedor.</p></div><div className="hero-stats"><div><small>ECONOMIA MÉDIA</small><strong>{averageSaving.toFixed(0)}<sup>%</sup></strong><span><TrendingDown size={14} /> nas ofertas monitoradas</span></div><div><small>ATUALIZAÇÕES</small><strong className="time">15 min</strong><span><Clock3 size={14} /> dados em intervalos</span></div></div></section>
      <form className="toolbar" id="ofertas" onSubmit={handleSearch}>
        <div className="search"><Search size={18}/><input aria-label="Buscar perfume" placeholder="Digite um perfume, por exemplo: 212" value={query} onChange={(event) => { setQuery(event.target.value); setLiveResult(null); setSearchError('') }} />
          {(suggestions.length > 0 || suggesting) && !liveResult && <div className="suggestions" role="listbox" aria-label="Perfumes encontrados">{suggesting && <div className="suggestion-loading">Procurando no Compras no Paraguai…</div>}{suggestions.map((item) => <button type="button" key={item.url} onClick={() => selectProduct(item)}><strong>{item.name}</strong><span>{item.volumeMl ? `${item.volumeMl} ml` : 'Consulte o volume no produto'}</span></button>)}</div>}
        </div>
        <button className="search-button" disabled={loading || suggesting || query.trim().length < 2}>{loading ? 'Carregando ofertas…' : suggesting ? 'Procurando…' : 'Buscar preços'}</button>
        <label className="select-wrap"><select aria-label="Filtrar fornecedor" value={supplier} onChange={(e) => setSupplier(e.target.value)}><option>Todos os fornecedores</option>{suppliers.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16}/></label>
        <span className="result-count">{liveResult ? `${liveResult.offers.length} fornecedores` : `${suggestions.length} opções`}</span>
      </form>
      {searchError && <div className="search-error">{searchError}</div>}
      {mlStatus === 'connected' && <div className="connection-message success">Mercado Livre conectado. Pesquise novamente o perfume para carregar os anúncios brasileiros.</div>}
      {mlStatus === 'missing-config' && <div className="connection-message">A aplicação do Mercado Livre ainda precisa ser configurada na Vercel.</div>}
      {mlStatus === 'auth-error' && <div className="connection-message error">Não foi possível concluir a conexão com o Mercado Livre. Confira o endereço de retorno da aplicação.</div>}
      {liveResult && <LiveResults result={liveResult} />}
      {!liveResult && !query && <section className="offers"><div className="demo-label">EXEMPLOS DO PAINEL</div>{filtered.map((comparison) => <OfferCard key={comparison.source.id} comparison={comparison} />)}</section>}
      <section className="method" id="metodo"><span>COMPARAÇÃO SEGURA</span><h2>Mesmo perfume. Mesmo volume.</h2><p>Cada opção mantém modelo, versão e volume separados. Os preços e a disponibilidade podem mudar no site de origem.</p></section>
    </main>
    <footer><span>Consulta pessoal de preços.</span><span>Atualizações em intervalos · sem garantia de tempo real</span></footer>
  </div>
}
