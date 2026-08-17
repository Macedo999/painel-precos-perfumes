# Painel de preços de perfumes

MVP de um painel web para comparar ofertas de perfumes do **Compras no Paraguai** com anúncios equivalentes do **Mercado Livre**. Cada oferta paraguaia aparece separada por fornecedor, com preço na moeda de origem, conversão estimada para reais, ao menos três referências brasileiras e a diferença absoluta e percentual.

> Os dados incluídos são demonstrativos. Os links levam a páginas de busca/origem e não representam uma captura ao vivo.

## Como iniciar

Requer Node.js 20 ou superior.

```bash
npm install
cp .env.example .env
npm run dev
```

Abra o endereço indicado no terminal. Para validar a versão de produção:

```bash
npm test
npm run build
npm run preview
```

## Estrutura

- `src/components`: componentes visuais reutilizáveis.
- `src/data`: dados demonstrativos, substituíveis por fontes reais.
- `src/services/matching.ts`: normalização, equivalência por nome e volume e cálculos.
- `src/services/providers.ts`: contratos dos conectores externos.
- `src/types.ts`: modelo comum das ofertas.

O pareamento exige um nome canônico compatível **e volume idêntico em ml**. Isso impede, por exemplo, comparar um frasco de 50 ml com um de 100 ml. Em produção, recomenda-se ainda validar concentração (EDT/EDP), versão, kit e GTIN quando disponível.

## Variáveis de ambiente

Copie `.env.example` para `.env`. As variáveis previstas são:

| Variável | Uso |
|---|---|
| `VITE_DATA_MODE` | `demo` no MVP; futuramente seleciona uma API própria. |
| `MERCADO_LIVRE_ACCESS_TOKEN` | Token da integração oficial, armazenado **somente no backend**. |
| `CNP_COLLECTOR_ENABLED` | Habilita o coletor responsável após revisão dos termos. |
| `CNP_REQUEST_INTERVAL_MS` | Intervalo mínimo entre consultas do coletor. |
| `CNP_CACHE_TTL_MINUTES` | Tempo de cache para reduzir acessos repetidos. |
| `EXCHANGE_RATE_PROVIDER_URL` | Serviço autorizado para conversão PYG/USD → BRL. |

Nunca exponha tokens usando o prefixo `VITE_`, pois essas variáveis são incorporadas ao JavaScript do navegador.

## Integração futura com Mercado Livre

Implemente um endpoint de backend que use a API oficial do Mercado Livre e devolva o modelo `SourceOffer`. O `MercadoLivreProvider` em `src/services/providers.ts` já consome esse contrato. A aplicação deve guardar credenciais no servidor, lidar com renovação/autorização conforme a documentação oficial e respeitar limites de requisição. Consulte a documentação vigente antes de implementar, pois os requisitos podem mudar.

## Coleta responsável do Compras no Paraguai

O `ComprasNoParaguaiProvider` é deliberadamente apenas uma interface para um backend/coletor. Antes de ativá-lo:

1. confirme permissão, termos de uso e `robots.txt` vigentes;
2. prefira API ou feed oficial, se disponível;
3. use cache, identificação apropriada, baixa frequência e retentativa exponencial;
4. registre a origem, horário, moeda e fornecedor de cada preço;
5. não contorne bloqueios nem mecanismos anti-automação.

O frontend não deve fazer coleta direta. Um processo agendado no servidor pode atualizar um banco ou cache e servir resultados normalizados à interface.

## Atualização e câmbio

As atualizações são executadas **em intervalos**, conforme a agenda e os limites das fontes; não há garantia de streaming ou tempo real. A data/hora exibida deve ser a da última coleta bem-sucedida. Conversões para reais são estimativas: registre a taxa, a fonte e o horário usados e deixe claro que impostos, frete e IOF podem alterar o custo final.

## Publicação

O projeto pode ser publicado como site estático após `npm run build`; a pasta gerada é `dist`. Configure integrações e segredos em um backend separado. Este diretório não foi publicado, commitado nem associado a um repositório remoto.
