# Painel de preços de perfumes

Painel pessoal que pesquisa perfumes no **Compras no Paraguai**, mantém cada anunciante paraguaio como um fornecedor separado e compara o mesmo modelo e volume com anúncios brasileiros do **Mercado Livre**. A área da Shopee está preparada para uma integração oficial futura.

Produção: <https://painel-precos-perfumes.vercel.app>

## Como funciona

1. A busca apresenta os produtos encontrados no Compras no Paraguai, separados por versão e volume.
2. O produto escolhido exibe os preços de cada fornecedor paraguaio em dólar e a conversão aproximada em reais.
3. A integração oficial do Mercado Livre busca anúncios brasileiros e descarta resultados com volume ou variante diferente.
4. O painel calcula a faixa de preços e a diferença em reais e percentual contra a menor oferta encontrada no Paraguai.

As consultas são atualizadas por intervalos e usam cache. Não há garantia de streaming ou atualização instantânea. Preço, estoque, câmbio, frete, impostos e IOF podem mudar no site de origem.

## Desenvolvimento

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Validação:

```bash
npm test
npm run build
```

## Configuração do Mercado Livre

Crie uma aplicação no DevCenter do Mercado Livre e cadastre exatamente este endereço de retorno:

```text
https://painel-precos-perfumes.vercel.app/api/mercadolivre-callback
```

Configure as variáveis abaixo na Vercel para os ambientes de produção e preview:

| Variável | Uso |
|---|---|
| `MERCADO_LIVRE_CLIENT_ID` | Identificador da aplicação no Mercado Livre. |
| `MERCADO_LIVRE_CLIENT_SECRET` | Chave secreta da aplicação; nunca deve ser enviada ao frontend ou ao GitHub. |
| `MERCADO_LIVRE_REDIRECT_URI` | `https://painel-precos-perfumes.vercel.app/api/mercadolivre-callback` |

Depois de publicar novamente, pesquise um perfume e use **Conectar Mercado Livre**. O fluxo OAuth guarda os tokens em cookies seguros, `HttpOnly` e `SameSite=Lax`. O access token é enviado à API somente pelo backend e o refresh token é substituído quando necessário.

## Shopee

Enquanto a conta não tiver acesso à Shopee Open Platform ou à API oficial de afiliados, o painel oferece apenas um link de pesquisa manual. Não são exibidos preços não verificados e não há coleta automatizada direta das páginas da Shopee.

## Estrutura

- `api/search.js`: pesquisa de produtos no coletor do Compras no Paraguai.
- `api/offers.js`: preços separados por fornecedor paraguaio.
- `api/marketplaces.js`: equivalência e preços brasileiros.
- `api/mercadolivre-start.js`: início da autorização oficial.
- `api/mercadolivre-callback.js`: troca segura do código por tokens.
- `api/lib/mercadolivre.js`: gestão e renovação dos tokens.
- `src/components/MarketplaceComparison.tsx`: faixa de preços e diferenças.
- `worker/`: coletor responsável do Compras no Paraguai, com cache e limites.

## Equivalência de produtos

O volume em mililitros deve ser idêntico. Marcadores de variante como `Rosé`, `Black`, `Sexy`, `Heroes`, `Elixir`, `Intense` e `Absolu` também são verificados. Isso impede, por exemplo, comparar 212 VIP 80 ml com 212 VIP Rosé 80 ml ou com um frasco de 100 ml.

## Coleta responsável

O Compras no Paraguai é consultado pelo backend, com cache e frequência limitada. A implementação não deve contornar bloqueios ou mecanismos anti-automação. Sempre prefira uma API ou feed autorizado caso a plataforma disponibilize um canal oficial.

## Publicação

O frontend Vite e as funções `api/` são publicados juntos na Vercel. Segredos devem permanecer nas variáveis de ambiente da plataforma. O diretório `dist/`, dependências locais, tokens e arquivos `.env` não devem ser enviados ao repositório.
