# Escopo e arquitetura

## Adaptação da referência

O projeto reúne calculadoras por assunto e preserva o conversor de moedas. Mantém separação de responsabilidades, formatação localizada, responsividade e premissas explícitas para os cálculos.

| Referência Angular | Versão para iniciantes |
| --- | --- |
| Template e componentes | HTML semântico e funções que atualizam a página |
| Estilos de componentes | Um arquivo CSS organizado por seções |
| API client / data-access do câmbio | `js/api.js` |
| Cotações públicas de ações | `js/stocks.js` |
| Estado do conversor | Objeto `state` em `js/app.js` |
| Calculadoras e resultados | `js/calculators.js` |
| Componentes de gráfico | `js/chart.js` e `js/calculators.js`, usando SVG nativo |
| Pipes de dinheiro e data | `toLocaleString` e `toLocaleDateString` |
| RxJS e cancelamento | `AbortController` e identificador de requisição |

As calculadoras são simulações locais e não enviam os valores digitados a um servidor. A carteira é uma lista local de posições, sem login, envio de ordens, transações ou sincronização entre dispositivos. O acesso direto às APIs públicas é usado para câmbio e cotações, sem incluir dados privados.

## Fluxo

```text
Usuário → calculadora selecionada → formulário em calculators.js → resultado + SVG
       → conversor em app.js → api.js → API Frankfurter
       → carrossel/carteira → stocks.js → API brapi.dev
                                      ↓
                      carteira local em portfolio.js → localStorage
                                      ↓
                         HTML + gráficos SVG
```

## Decisões de implementação

- Sem dependências externas de interface ou gráfico.
- A última seleção prevalece: requisições anteriores são canceladas e respostas antigas são ignoradas.
- Cotação e histórico são independentes. Se apenas um falhar, os dados disponíveis continuam visíveis.
- Trocar moeda ou período remove os resultados anteriores, evitando apresentar dados de outro par.
- Valores negativos e resultados numéricos infinitos não são convertidos.
- Mesma moeda significa taxa 1 e linha constante, sem requisição desnecessária.
- Dados externos entram no DOM com `textContent` ou APIs de criação de elementos.
- Datas são formatadas com fuso explícito para evitar que o dia da cotação mude.
- Os cartões do catálogo abrem calculadoras individualmente; o botão "Todas as calculadoras" retorna à lista.
- Gráficos das calculadoras mostram comparação ou evolução do resultado; todos têm descrição acessível.
- Projeções de juros e investimento exibem abaixo do gráfico a evolução mensal estimada: saldo, aportes/retiradas, lucro/prejuízo e rentabilidade do mês, e resultado acumulado calculado como aportes menos retiradas mais o lucro/prejuízo acumulado. Comparações apresentam os valores dos dois cenários; os percentuais dependem das taxas hipotéticas informadas.
- A Calculadora de Renda, em "Mais acessadas", permite combinar um aporte fixo mensal com uma retirada fixa mensal. A retirada em cada período não excede o saldo disponível.
- No gráfico de câmbio, mover o cursor sobre a área de dados destaca a observação diária mais próxima e mostra sua data e valor em uma dica visual; as setas do teclado percorrem os pontos.
- A faixa sob o menu é um letreiro contínuo (marquee) de ações da B3; tem setas, controle de pausa, pausa ao passar o mouse e respeita a preferência por movimento reduzido.
- O carrossel e a carteira compartilham a lista de ações retornada pela brapi.dev. Os preços representam o fechamento disponível (`close`), sem promessa de atualização em tempo real; erros e indisponibilidades não são substituídos por dados fictícios.
- A carteira guarda ticker, quantidade e preço médio somente no `localStorage` do navegador. Os dados privados não são incluídos nas requisições públicas de cotação.
- A carteira apresenta valor atual e lucro/prejuízo estimados antes de taxas e impostos, além de uma estimativa diária calculada pela variação retornada da fonte. Ativos sem cotação ficam sinalizados e não entram nos totais atuais.
- A busca filtra o catálogo, informa quantos resultados encontrou e abre o primeiro resultado com Enter.
- As fórmulas legais, tributárias e de mercado não são tratadas como fonte oficial: alíquotas e hipóteses variáveis são editáveis e as limitações aparecem com o resultado.

## Entregas e evolução

**Entregue:** calculadoras agrupadas e pesquisáveis, formulário e gráfico para cada ferramenta, conversor com histórico, períodos, tabela, estatísticas e estados de erro, além de cotações da B3 e carteira local com painel gráfico.

**Evoluções opcionais:** tabelas oficiais atualizadas por fonte verificável, testes automatizados de navegador, exportação CSV, acompanhamento de cenários, alertas, sincronização da carteira e autenticação; esses recursos exigiriam requisitos e, em alguns casos, um backend.

## Roteiro de validação manual

| Ação | Resultado esperado |
| --- | --- |
| Abrir a página conectado | EUR/BRL, data, conversão e histórico reais |
| Digitar 10 na origem | Destino igual a 10 vezes a cotação, com até 6 casas |
| Digitar um valor no destino | Origem recalculada pela divisão |
| Limpar o campo editado | Outro campo fica vazio |
| Digitar valor negativo | Campo fica inválido e destino não apresenta conversão |
| Inverter moedas | Seletores trocados e nova cotação carregada |
| Selecionar a mesma moeda | Taxa 1, conversão equivalente e gráfico constante |
| Trocar o período | Filtro ativo e histórico correspondente |
| Trocar moedas rapidamente | Somente o último par selecionado aparece |
| Abrir “Ver dados do gráfico” | Tabela com datas e taxas do período |
| Mover o cursor sobre diferentes posições do gráfico de câmbio | Mira acompanha o ponto diário mais próximo e a dica mostra a data completa e o valor na moeda selecionada |
| Focar o gráfico de câmbio e usar as setas | A dica percorre os valores históricos por data |
| Desconectar e atualizar | Mensagem de falha e possibilidade de tentar novamente |
| Navegar com Tab e Enter | Campos e botões acessíveis, com foco visível |
| Testar largura de 375 px | Conteúdo em uma coluna, sem rolagem horizontal da página |
| Selecionar uma calculadora no catálogo | A ferramenta escolhida aparece e as demais ficam ocultas |
| Carrossel de ativos em movimento | A faixa corre continuamente em velocidade constante, para ao passar o mouse e pode ser pausada manualmente |
| Preferência do sistema por movimento reduzido | O avanço automático fica pausado |
| Buscar uma calculadora e pressionar Enter | O primeiro resultado correspondente abre |
| Buscar um termo sem correspondência | A página informa que não encontrou calculadoras |
| Abrir uma calculadora e enviar os valores iniciais | Resultado e gráfico correspondentes são exibidos |
| Alterar taxa ou prazo e recalcular | Resultado e gráfico são atualizados com as novas premissas |
| Calcular juros compostos por 12 meses | Tabela abaixo do gráfico contém 12 linhas e mostra saldo, lucro/prejuízo e rentabilidade mensal, além do resultado acumulado de aportes, retiradas e rendimentos |
| Comparar dois cenários de investimento | Tabela mostra lucro/prejuízo e rentabilidade mensal, mais resultado acumulado de cada cenário |
| Informar simultaneamente aporte e retirada na Calculadora de Renda | Saldo mensal, aportes, retiradas e lucro/prejuízo refletem ambos os movimentos, sem permitir saldo negativo |
| Usar uma calculadora trabalhista | Resultado mostra que as alíquotas são estimativas informadas pelo usuário |
| Abrir "Minha carteira" | Ações retornadas pela fonte podem ser buscadas por ticker ou nome |
| Adicionar a mesma ação mais de uma vez | Quantidades são somadas e preço médio é recalculado ponderando os custos |
| Adicionar uma posição com cotação disponível | KPIs, tabela e gráfico mostram valores com base no fechamento retornado |
| Atualizar cotações | Consulta a fonte de novo e atualiza o carrossel e os resultados da carteira |
| Recarregar a página | Posições permanecem neste navegador, sem serem enviadas ao provedor |
| Remover uma posição | Carteira salva, KPIs e gráfico são recalculados |
| Bloquear rede ou exceder limite da API | Uma mensagem explícita aparece; a página não inventa preços |
| Abrir a carteira em largura de celular | Formulário se reorganiza e tabela pode ser rolada horizontalmente |

Esses são critérios para execução no navegador, não uma declaração de testes automatizados realizados.
