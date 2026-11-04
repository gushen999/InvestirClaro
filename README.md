# Investir Claro

Calculadoras de finanças, trabalho e utilidades, além de um conversor de moedas, em **HTML, CSS e JavaScript puro**. Sem instalação de pacotes ou etapa de compilação.

## Como executar

1. Abra a pasta do projeto no VS Code.
2. Abra `index.html` com a extensão **Live Server** (opção **Open with Live Server**).
3. A página abre no navegador. É necessária conexão com a internet para consultar as cotações.

Também é possível abrir `index.html` diretamente no navegador: os scripts são tradicionais e não dependem de módulos. Caso o navegador restrinja requisições de arquivos locais, use o Live Server.

## O que o projeto entrega

- 39 calculadoras em 4 grupos, acessadas pelo catálogo de cartões.
- Catálogo organizado em cartões por categoria, com busca e paleta preto e amarelo.
- Carrossel contínuo com preços de fechamento e variações retornados pela brapi.dev, setas e controle de pausa; falhas da fonte são exibidas sem inventar cotações.
- Aba "Minha carteira" para registrar quantidade e preço médio por ação, acompanhar valor atual e estimativas de lucro/prejuízo em um painel com gráfico SVG.
- Carteira salva somente no `localStorage` deste navegador; quantidades e preços médios não são enviados à API.
- Busca com filtro em tempo real e abertura do primeiro resultado com Enter; os cartões abrem cada calculadora em sua própria área.
- Campos específicos para cada ferramenta, resultados resumidos e gráficos SVG acessíveis.
- Simuladores de juros e investimento incluem, logo abaixo do gráfico, uma tabela mensal de saldo, lucro/prejuízo e rentabilidade do mês, além do resultado acumulado que combina aportes, retiradas e lucro/prejuízo; cenários comparados exibem os valores de ambos.
- A Calculadora de Renda, em "Mais acessadas", aceita um aporte recorrente e uma retirada recorrente no mesmo mês, limitando a retirada ao saldo disponível.
- Premissas e limites explicados junto aos resultados; taxas e alíquotas não oficiais são editáveis.
- Conversor EUR/BRL (e outras moedas), com histórico diário consultado pela API Frankfurter.

- Seleção entre 16 moedas, começando em EUR/BRL.
- Conversão enquanto você digita, nos dois sentidos.
- Botão para inverter origem e destino.
- Gráfico SVG com períodos de 5 dias, 1 mês (30 dias), 6 meses (180 dias), 1 ano (365 dias) e 5 anos (1.825 dias).
- Variação percentual, mínima e máxima no período e última cotação do histórico.
- Gráfico cambial interativo: ao mover o cursor sobre a linha, uma mira destaca a cotação mais próxima e mostra dia, valor e moeda; as setas do teclado também percorrem os pontos. Tabela acessível com todos os dados.
- Data da cotação, estados de carregamento, erro e falha parcial, além de botão para tentar novamente.
- Layout adaptado para celular, tablet e computador.

## Organização

```text
invest-project/
├── index.html          # Estrutura e elementos da página
├── css/
│   ├── styles.css        # Aparência base, cabeçalho, busca e conversor
│   ├── chart-tooltip.css  # Dica interativa e mira do gráfico cambial
│   ├── calculators.css   # Aparência das calculadoras e gráficos
│   ├── market-ticker.css # Carrossel de ativos
│   └── portfolio.css     # Carteira, painel, tabela e gráfico
├── js/
│   ├── api.js          # Requisições HTTP, validação e organização dos dados
│   ├── chart.js        # Desenho do gráfico em SVG
│   ├── stocks.js       # Consulta/cache em memória de cotações públicas da B3
│   ├── calculators.js  # Ferramentas, cálculos, resultados e gráficos
│   ├── market-ticker.js # Carrossel de cotações
│   ├── portfolio.js    # Carteira local, resultados e gráfico por ativo
│   └── app.js          # Eventos, estado e atualização do conversor
├── docs/
│   └── MVP.md          # Escopo, arquitetura simplificada e roteiro de testes
└── README.md
```

Os scripts usam `defer`: executam na ordem declarada, depois que o HTML foi interpretado. `stocks.js` carrega antes do carrossel e da carteira, que compartilham a consulta pública; `api.js` e `chart.js` vêm antes do conversor.

## Entendendo o fluxo

1. O HTML cria os campos e espaços para os resultados.
2. `app.js` preenche os seletores e escuta eventos como `input`, `change` e `click`.
3. Ao trocar uma moeda, `load()` pede a cotação atual e o histórico ao `CurrencyAPI`.
4. `api.js` usa `fetch()` e transforma a resposta JSON em objetos JavaScript.
5. A página mostra os números usando `Intl` através de `toLocaleString` e desenha o histórico com `CurrencyChart.render()`.
6. Digitar um valor reutiliza a cotação carregada, sem chamar a API novamente.

Nas calculadoras, `calculators.js` define as ferramentas, valida os campos, calcula estimativas e monta os resultados e gráficos SVG. Selecione um cartão do catálogo para abrir uma calculadora; o botão "Todas as calculadoras" retorna à lista. As taxas financeiras e alíquotas trabalhistas que variam por produto, legislação ou situação são fornecidas pelo usuário; os resultados não substituem orientação profissional.

## Cotações e carteira

`stocks.js` consulta `https://brapi.dev/api/quote/list`, mantém os dados em memória por até 60 segundos e reutiliza uma solicitação em andamento. O carrossel destaca ativos brasileiros com preço de fechamento (`close`) e variação retornados pelo provedor. A disponibilidade e o atraso dos dados dependem da fonte; não são cotações garantidamente em tempo real. A documentação e as condições da API estão em https://brapi.dev/docs.

Na aba "Minha carteira", selecione uma ação, informe quantidade e preço médio de compra. A aplicação calcula valor investido (`quantidade × preço médio`), valor atual (`quantidade × último fechamento disponível`) e lucro/prejuízo estimado antes de taxas e impostos. O resultado diário da carteira é uma estimativa ponderada a partir da variação retornada pela fonte. Ativos sem cotação disponível são sinalizados e não entram no valor atual nem no resultado total.

As posições ficam em `localStorage` neste navegador e dispositivo. Limpar os dados do navegador remove a carteira. A API recebe somente a consulta pública de cotações; não recebe quantidade, preço médio ou outras posições do usuário. Não existe cópia de segurança ou sincronização entre dispositivos.

Exemplo: se a taxa recebida for 5,96, a estimativa para 10 euros será `10 * 5.96`, ou 59,60 reais. No sentido inverso, o código divide pela taxa. Esse número é apenas um exemplo, não é uma cotação embutida no projeto.

## API aberta

Documentação: https://frankfurter.dev/

```text
GET https://api.frankfurter.dev/v2/rates?base=EUR&quotes=BRL
GET https://api.frankfurter.dev/v2/rates?base=EUR&quotes=BRL&from=2026-10-01
```

A resposta é uma lista de objetos com `date`, `base`, `quote` e `rate`. O endereço inicial do histórico é calculado a partir da data atual; o exemplo acima serve para estudar o contrato. A API é pública, sem chave, e agrega fontes oficiais.

**Os dados são diários, não em tempo real.** Fins de semana e feriados podem não ter novas observações. A data exibida é a data retornada pelo provedor. Os intervalos são aproximados em dias corridos, e a variação compara a primeira com a última observação disponível. A cotação mais recente e o histórico são consultas independentes e podem ter datas diferentes.

O catálogo foi limitado a 16 moedas para simplificar o estudo; não representa todas as moedas da API. Valores são estimativas com `Number`, sem tarifas, impostos ou spread. Não são cálculos para execução de transações. Não há dados fictícios de reserva: se a API falhar, a página informa a indisponibilidade.

## Por onde estudar

1. **HTML:** `label`, `input`, `select`, semântica e acessibilidade.
2. **CSS:** variáveis, Grid, Flexbox e media queries.
3. **JavaScript:** objetos, funções, seleção do DOM e eventos.
4. **Assincronismo:** `fetch`, `async/await`, `Promise.allSettled` e `AbortController`.
5. **Gráfico:** transformação de datas e valores em coordenadas SVG.

O projeto não exige backend. Se futuramente uma fonte exigir chave secreta, a chamada deverá passar por um backend, sem colocar a chave no JavaScript público.
