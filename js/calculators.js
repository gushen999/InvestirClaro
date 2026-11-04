/* Calculadoras independentes do conversor; os resultados são estimativas educativas. */
const CalculatorHub = (() => {
  const categories = [
    { id: 'popular', title: 'Mais acessadas', description: 'As ferramentas mais usadas para planejar suas finanças.' },
    { id: 'financial', title: 'Calculadoras financeiras', description: 'Ferramentas para investimentos e planejamento financeiro.' },
    { id: 'labor', title: 'Calculadoras trabalhistas', description: 'Estimativas de renda, benefícios e custos do trabalho.' },
    { id: 'utility', title: 'Calculadoras utilitárias', description: 'Comparações e ferramentas práticas para o dia a dia.' }
  ];
  const calculators = [
    { id: 'compound', category: 'popular', icon: '∑', title: 'Juros Compostos', description: 'Veja como aportes e juros podem fazer seu dinheiro crescer.', kind: 'compound' },
    { id: 'cards', category: 'popular', icon: '▣', title: 'Comparador de Cartões', description: 'Compare o retorno estimado de benefícios e custos anuais.', kind: 'cards' },
    { id: 'income', category: 'popular', icon: '↘', title: 'Calculadora de Renda', description: 'Simule retiradas mensais e veja a evolução do patrimônio.', kind: 'income' },
    { id: 'million', category: 'popular', icon: '1', title: 'Primeiro Milhão', description: 'Estime quando seu patrimônio pode alcançar R$ 1 milhão.', kind: 'million' },

    { id: 'retirement', category: 'financial', icon: '⌂', title: 'Aposentadoria', description: 'Projete seus aportes e estime o patrimônio para a renda desejada.', kind: 'retirement' },
    { id: 'rent-finance', category: 'financial', icon: '⌂', title: 'Aluguel x Financiamento', description: 'Compare o patrimônio estimado ao alugar ou financiar um imóvel.', kind: 'rent-finance' },
    { id: 'savings-selic', category: 'financial', icon: '↗', title: 'Poupança x Selic', description: 'Compare cenários de rendimento com taxas informadas por você.', kind: 'fixed' },
    { id: 'simple', category: 'financial', icon: '%', title: 'Juros Simples', description: 'Calcule o crescimento linear de um valor com aportes mensais.', kind: 'simple' },
    { id: 'compound-finance', category: 'financial', icon: '∑', title: 'Juros Compostos', description: 'Simule o efeito dos juros compostos ao longo do tempo.', kind: 'compound' },
    { id: 'income-finance', category: 'financial', icon: '↘', title: 'Calculadora de Renda', description: 'Projete a duração de um patrimônio com retiradas periódicas.', kind: 'income' },
    { id: 'fixed-income', category: 'financial', icon: '▥', title: 'Calculadora de Renda Fixa', description: 'Compare até dois cenários de renda fixa com taxas personalizadas.', kind: 'fixed' },
    { id: 'yield-simulator', category: 'financial', icon: '⌁', title: 'Simulador de Rentabilidade', description: 'Compare a evolução de dois cenários de investimento.', kind: 'two-rates' },
    { id: 'stocks', category: 'financial', icon: '▤', title: 'Comparador de Ações', description: 'Compare cenários hipotéticos de rentabilidade, sem dados de mercado.', kind: 'two-rates' },
    { id: 'million-finance', category: 'financial', icon: '1', title: 'Primeiro Milhão', description: 'Calcule o prazo estimado para atingir sua meta de patrimônio.', kind: 'million' },
    { id: 'emergency', category: 'financial', icon: '▱', title: 'Reserva de Emergência', description: 'Descubra sua meta de reserva e quanto falta acumular.', kind: 'emergency' },
    { id: 'cash-installments', category: 'financial', icon: '▣', title: 'Compra à vista ou parcelada', description: 'Compare o custo à vista com o valor presente das parcelas.', kind: 'cash-installments' },
    { id: 'pix', category: 'financial', icon: '⌁', title: 'Juros no Pix Parcelado', description: 'Estime a parcela e o custo total a partir da taxa informada.', kind: 'pix' },
    { id: 'cdb', category: 'financial', icon: '▤', title: 'Calculadora de CDB', description: 'Estime o valor bruto e líquido usando CDI, percentual e imposto informados.', kind: 'cdb' },
    { id: 'mark-to-market', category: 'financial', icon: '↗', title: 'Marcação a Mercado', description: 'Veja como a taxa de mercado altera o valor presente de um título hipotético.', kind: 'mark-to-market' },
    { id: 'amortization', category: 'financial', icon: '▦', title: 'Calculadora de Amortização', description: 'Compare parcelas e saldo devedor nos sistemas SAC e Price.', kind: 'amortization' },

    { id: 'pj', category: 'labor', icon: '▣', title: 'Calculadora PJ', description: 'Estime o valor líquido após impostos e despesas informados.', kind: 'pj' },
    { id: 'net-salary', category: 'labor', icon: 'R$', title: 'Salário Líquido', description: 'Estime os descontos usando alíquotas efetivas definidas por você.', kind: 'salary' },
    { id: 'clt-pj', category: 'labor', icon: '⇄', title: 'CLT vs PJ', description: 'Compare rendas líquidas estimadas com benefícios e custos informados.', kind: 'clt-pj' },
    { id: 'thirteenth', category: 'labor', icon: '12', title: 'Décimo Terceiro', description: 'Estime o décimo terceiro proporcional aos meses trabalhados.', kind: 'thirteenth' },
    { id: 'employee-cost', category: 'labor', icon: '＋', title: 'Custo de Funcionário CLT', description: 'Some salário, encargos e benefícios para estimar o custo mensal.', kind: 'employee-cost' },
    { id: 'vacation', category: 'labor', icon: '⌂', title: 'Calculadora de Férias', description: 'Estime remuneração de férias e adicional de um terço.', kind: 'vacation' },
    { id: 'proportional-vacation', category: 'labor', icon: '⌂', title: 'Férias Proporcionais', description: 'Estime férias proporcionais ao período trabalhado.', kind: 'thirteenth' },
    { id: 'inss', category: 'labor', icon: '%', title: 'Calculadora de INSS', description: 'Calcule uma estimativa com a alíquota efetiva que você informar.', kind: 'inss' },
    { id: 'fgts', category: 'labor', icon: '▤', title: 'Calculadora de FGTS', description: 'Projete depósitos mensais e rendimento informado ao longo do tempo.', kind: 'fgts' },
    { id: 'overtime', category: 'labor', icon: '◷', title: 'Horas Extras', description: 'Estime o valor das horas extras com adicional personalizável.', kind: 'overtime' },
    { id: 'unemployment', category: 'labor', icon: '↘', title: 'Seguro Desemprego', description: 'Faça uma estimativa simples a partir do benefício mensal informado.', kind: 'unemployment' },
    { id: 'income-reality', category: 'labor', icon: '▥', title: 'Salário na Realidade Brasileira', description: 'Compare sua renda com um valor de referência informado por você.', kind: 'reality' },
    { id: 'income-tax', category: 'labor', icon: '%', title: 'Isenção do Imposto de Renda 2026', description: 'Compare a renda com um limite e alíquota efetiva definidos por você.', kind: 'income-tax' },
    { id: 'termination', category: 'labor', icon: '✓', title: 'Rescisão Trabalhista', description: 'Estime componentes básicos da rescisão; regras específicas não estão incluídas.', kind: 'termination' },

    { id: 'days', category: 'utility', icon: '▦', title: 'Contador de Dias', description: 'Calcule a diferença em dias corridos entre duas datas.', kind: 'days' },
    { id: 'business-days', category: 'utility', icon: '▦', title: 'Contador de Dias Úteis', description: 'Conte dias de segunda a sexta entre duas datas, sem feriados.', kind: 'business-days' },
    { id: 'vehicle', category: 'utility', icon: '↔', title: 'Combustível vs Elétrico', description: 'Compare o custo anual estimado de energia e combustível.', kind: 'vehicle' },
    { id: 'fixed-costs', category: 'utility', icon: '◔', title: 'Calculadora de Custos Fixos', description: 'Some gastos mensais e compare com sua renda.', kind: 'fixed-costs' },
    { id: 'cards-utility', category: 'utility', icon: '▣', title: 'Comparador de Cartões', description: 'Compare anuidade e benefícios com base nos gastos informados.', kind: 'cards' }
  ];

  const commonRateFields = [
    ['initial', 'Valor inicial', 10000, 'money'],
    ['monthly', 'Aporte mensal', 500, 'money'],
    ['annualRate', 'Rentabilidade anual estimada', 8, 'percent'],
    ['years', 'Prazo (anos)', 10, 'years']
  ];
  const field = (key, label, value, unit = 'money', extra = {}) => ({ key, label, value, unit, ...extra });
  const schemas = {
    compound: commonRateFields.map(([key, label, value, unit]) => field(key, label, value, unit)),
    simple: commonRateFields.map(([key, label, value, unit]) => field(key, label, value, unit)),
    million: [field('initial', 'Patrimônio inicial', 10000), field('monthly', 'Aporte mensal', 1000), field('annualRate', 'Rentabilidade anual estimada', 8, 'percent'), field('target', 'Meta de patrimônio', 1000000)],
    retirement: [field('age', 'Sua idade atual', 30, 'count', { min: 18 }), field('retireAge', 'Idade desejada para parar de trabalhar', 60, 'count', { min: 19 }), field('monthlyIncome', 'Renda mensal desejada', 5000), field('initial', 'Patrimônio já acumulado', 0), field('monthly', 'Aporte mensal', 1000), field('annualRate', 'Rentabilidade anual estimada', 8, 'percent')],
    income: [field('initial', 'Patrimônio inicial', 100000), field('monthlyContribution', 'Aporte mensal', 0), field('monthlyWithdrawal', 'Retirada mensal', 2500), field('annualRate', 'Rentabilidade anual estimada', 6, 'percent'), field('months', 'Prazo de projeção (meses)', 240, 'count')],
    emergency: [field('monthlyExpense', 'Gastos essenciais por mês', 4000), field('reserveMonths', 'Meses de cobertura desejados', 6, 'count'), field('saved', 'Valor já guardado', 5000)],
    fixed: [field('initial', 'Valor investido', 10000), field('months', 'Prazo (meses)', 36, 'count'), field('rateA', 'Taxa anual do cenário A (ex.: Selic)', 10.5, 'percent'), field('rateB', 'Taxa anual do cenário B (ex.: poupança)', 6, 'percent'), field('taxRate', 'Imposto sobre o rendimento do cenário A', 15, 'percent')],
    cdb: [field('initial', 'Valor investido', 10000), field('months', 'Prazo (meses)', 24, 'count'), field('annualRate', 'CDI anual de referência', 10.5, 'percent'), field('cdiPercent', 'Percentual do CDI', 100, 'percent'), field('taxRate', 'Imposto efetivo sobre rendimento', 15, 'percent')],
    'two-rates': [field('initial', 'Valor inicial', 10000), field('monthly', 'Aporte mensal', 500), field('months', 'Prazo (meses)', 60, 'count'), field('rateA', 'Rentabilidade anual do cenário A', 8, 'percent'), field('rateB', 'Rentabilidade anual do cenário B', 10, 'percent')],
    'rent-finance': [field('property', 'Valor do imóvel', 500000), field('down', 'Entrada', 100000), field('rent', 'Aluguel mensal', 2500), field('loanRate', 'Juros anuais do financiamento', 10, 'percent'), field('investmentRate', 'Rentabilidade anual do investimento', 8, 'percent'), field('appreciation', 'Valorização anual estimada do imóvel', 4, 'percent'), field('years', 'Prazo (anos)', 20, 'years')],
    'cash-installments': [field('cashPrice', 'Preço à vista', 5000), field('installmentTotal', 'Total das parcelas', 5500), field('installments', 'Número de parcelas', 10, 'count'), field('annualRate', 'Rentabilidade anual alternativa', 10, 'percent')],
    pix: [field('purchase', 'Valor financiado no Pix', 3000), field('installments', 'Número de parcelas', 12, 'count'), field('monthlyRate', 'Juros ao mês', 1.5, 'percent')],
    'mark-to-market': [field('face', 'Valor de resgate no vencimento', 1000), field('couponRate', 'Cupom anual estimado', 10, 'percent'), field('oldRate', 'Taxa de mercado anterior', 10, 'percent'), field('newRate', 'Nova taxa de mercado', 12, 'percent'), field('years', 'Anos até o vencimento', 5, 'years')],
    amortization: [field('principal', 'Valor financiado', 300000), field('annualRate', 'Juros anuais', 10, 'percent'), field('months', 'Prazo (meses)', 240, 'count'), field('system', 'Sistema de amortização', 'price', 'select', { options: [['price', 'Price (parcela constante)'], ['sac', 'SAC (amortização constante)']] })],
    pj: [field('revenue', 'Faturamento mensal PJ', 12000), field('taxRate', 'Impostos efetivos (%)', 10, 'percent'), field('expenses', 'Despesas mensais', 1000)],
    salary: [field('gross', 'Salário bruto mensal', 6000), field('inssRate', 'Alíquota efetiva de INSS (%)', 8, 'percent'), field('irRate', 'Alíquota efetiva de IR (%)', 5, 'percent'), field('other', 'Outros descontos mensais', 0)],
    'clt-pj': [field('gross', 'Salário bruto CLT', 8000), field('cltRate', 'Descontos efetivos CLT (%)', 15, 'percent'), field('benefits', 'Valor mensal estimado dos benefícios CLT', 800), field('pjRevenue', 'Faturamento mensal PJ equivalente', 11000), field('pjRate', 'Impostos e custos PJ (%)', 12, 'percent')],
    thirteenth: [field('salary', 'Salário bruto mensal', 4000), field('monthsWorked', 'Meses trabalhados no período', 12, 'count'), field('discountRate', 'Descontos efetivos estimados (%)', 8, 'percent')],
    vacation: [field('salary', 'Salário bruto mensal', 4000), field('vacationDays', 'Dias de férias', 30, 'count'), field('discountRate', 'Descontos efetivos estimados (%)', 8, 'percent')],
    'employee-cost': [field('salary', 'Salário bruto mensal', 4000), field('employerRate', 'Encargos estimados (%)', 28, 'percent'), field('benefits', 'Benefícios mensais', 600), field('provisionRate', 'Provisões adicionais estimadas (%)', 11, 'percent')],
    inss: [field('gross', 'Salário de contribuição', 4000), field('rate', 'Alíquota efetiva informada (%)', 8, 'percent')],
    fgts: [field('salary', 'Salário bruto mensal', 4000), field('months', 'Período (meses)', 60, 'count'), field('depositRate', 'Percentual mensal de depósito', 8, 'percent'), field('annualRate', 'Rendimento anual estimado', 3, 'percent')],
    overtime: [field('salary', 'Salário bruto mensal', 4000), field('monthlyHours', 'Horas mensais contratadas', 220, 'count'), field('overtimeHours', 'Horas extras realizadas', 10, 'count'), field('premium', 'Adicional de hora extra (%)', 50, 'percent')],
    unemployment: [field('averageSalary', 'Média salarial informada', 3000), field('monthlyBenefit', 'Valor estimado de cada parcela', 1800), field('installments', 'Número de parcelas estimado', 4, 'count')],
    reality: [field('salary', 'Sua renda mensal', 4000), field('reference', 'Renda mensal de referência', 1500)],
    'income-tax': [field('salary', 'Renda mensal tributável', 5000), field('threshold', 'Limite de isenção que deseja considerar', 3000), field('rate', 'Alíquota efetiva acima do limite', 7.5, 'percent')],
    termination: [field('salary', 'Salário bruto mensal', 4000), field('daysWorked', 'Dias trabalhados no mês', 15, 'count'), field('monthsWorked', 'Meses trabalhados no período aquisitivo', 8, 'count'), field('fgtsBalance', 'Saldo do FGTS informado', 10000), field('noticeDays', 'Dias de aviso prévio a indenizar', 0, 'count'), field('discountRate', 'Descontos efetivos estimados (%)', 8, 'percent')],
    cards: [field('spend', 'Gastos mensais no cartão', 3000), field('cashbackA', 'Retorno anual do cartão A (%)', 1, 'percent'), field('feeA', 'Anuidade do cartão A', 0), field('cashbackB', 'Retorno anual do cartão B (%)', 1.5, 'percent'), field('feeB', 'Anuidade do cartão B', 600)],
    days: [field('startDate', 'Data inicial', new Date().toISOString().slice(0, 10), 'date'), field('endDate', 'Data final', new Date().toISOString().slice(0, 10), 'date')],
    'business-days': [field('startDate', 'Data inicial', new Date().toISOString().slice(0, 10), 'date'), field('endDate', 'Data final', new Date().toISOString().slice(0, 10), 'date')],
    vehicle: [field('km', 'Quilometragem anual', 12000, 'count'), field('fuelEfficiency', 'Consumo do veículo a combustível (km/L)', 12, 'count'), field('fuelPrice', 'Preço do combustível por litro', 6), field('electricEfficiency', 'Consumo elétrico (kWh/100 km)', 18, 'count'), field('energyPrice', 'Preço da energia por kWh', 0.9), field('fuelMaintenance', 'Manutenção anual a combustível', 2500), field('electricMaintenance', 'Manutenção anual elétrica', 1500)],
    'fixed-costs': [field('income', 'Renda mensal líquida', 6000), field('housing', 'Moradia', 1800), field('transport', 'Transporte', 600), field('food', 'Alimentação', 1200), field('health', 'Saúde', 400), field('other', 'Outros custos fixos', 500)]
  };

  const money = value => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });
  const percent = value => `${Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;
  const clampMonths = value => Math.min(1200, Math.max(1, Math.round(value)));
  const monthlyRate = annual => Math.pow(1 + annual / 100, 1 / 12) - 1;
  const grow = (initial, monthly, rate, months) => {
    let balance = initial;
    const points = [{ label: 'Início', value: balance }];
    for (let month = 1; month <= clampMonths(months); month++) {
      balance = balance * (1 + rate) + monthly;
      if (month % Math.max(1, Math.ceil(months / 10)) === 0 || month === months) {
        points.push({ label: `${Math.ceil(month / 12)}º ano`, value: balance });
      }
    }
    return { balance, points };
  };
  const projectMonthly = (initial, contribution, rate, months, options = {}) => {
    const rows = [];
    let grossBalance = initial;
    let netCashFlow = 0;
    let cumulativeProfit = 0;
    let previousNetBalance = initial;
    const limit = Math.min(1200, Math.max(0, Math.round(months)));

    for (let month = 1; month <= limit; month++) {
      const earned = options.simple
        ? (initial + contribution * (month - 1)) * rate
        : grossBalance * rate;
      const available = Math.max(0, grossBalance + earned);
      const deposit = Math.max(0, options.deposit ?? contribution);
      const withdrawal = Math.min(Math.max(0, options.withdrawal || 0), available + deposit);
      grossBalance = Math.max(0, available + deposit - withdrawal);
      netCashFlow += deposit - withdrawal;
      const netBalance = initial + (grossBalance - initial) * (options.netFactor ?? 1);
      const profit = netBalance - previousNetBalance - deposit + withdrawal;
      cumulativeProfit += profit;
      rows.push({
        month,
        balance: netBalance,
        deposit,
        withdrawal,
        profit,
        returnPercent: previousNetBalance ? profit / previousNetBalance * 100 : 0,
        cumulativeResult: netCashFlow + cumulativeProfit
      });
      previousNetBalance = netBalance;
    }

    return rows;
  };
  const monthlyTable = (seriesA, labelA = 'Cenário', seriesB = null, labelB = 'Cenário B') => {
    const headers = seriesB
      ? ['Mês', ...[labelA, labelB].flatMap(label => [`Saldo ${label}`, `Aporte ${label}`, `Retirada ${label}`, `Lucro/prejuízo ${label}`, `Rentabilidade ${label}`, `Resultado acumulado ${label}`])]
      : ['Mês', 'Saldo estimado', 'Aporte', 'Retirada', 'Lucro/prejuízo do mês', 'Rentabilidade do mês', 'Resultado acumulado'];
    const rows = seriesA.map((row, index) => {
      const values = seriesB
        ? [row, seriesB[index]].flatMap(month => [month.balance, month.deposit, month.withdrawal, month.profit, month.returnPercent, month.cumulativeResult])
        : [row.balance, row.deposit, row.withdrawal, row.profit, row.returnPercent, row.cumulativeResult];
      return { period: `Mês ${row.month}`, values };
    });
    const percentColumns = seriesB ? [4, 10] : [4];
    const profitColumns = seriesB ? [3, 5, 9, 11] : [3, 5];
    return { headers, rows, percentColumns, profitColumns };
  };
  const result = (title, value, detail, points, note = '', monthly = null) => ({ title, value, detail, points, note, monthly });
  const n = (values, key) => Number(values[key] || 0);

  function calculate(kind, v) {
    const initial = n(v, 'initial'), monthly = n(v, 'monthly'), annualRate = n(v, 'annualRate');
    switch (kind) {
      case 'compound':
      case 'simple': {
        const months = clampMonths(n(v, 'years') * 12);
        const rate = monthlyRate(annualRate);
        let balance, points;
        if (kind === 'compound') {
          ({ balance, points } = grow(initial, monthly, rate, months));
        } else {
          balance = initial * (1 + rate * months) + monthly * (months + rate * months * (months - 1) / 2);
          points = Array.from({ length: 11 }, (_, i) => {
            const m = Math.round(months * i / 10);
            return { label: `${Math.round(m / 12)}º ano`, value: initial * (1 + rate * m) + monthly * (m + rate * m * (m - 1) / 2) };
          });
        }
        const invested = initial + monthly * months;
        return result('Valor estimado ao final', money(balance), `${money(invested)} investidos · ${money(balance - invested)} de rendimento estimado`, points, 'Taxa anual convertida em taxa mensal equivalente; aportes considerados ao fim de cada mês.', monthlyTable(projectMonthly(initial, monthly, rate, months, { simple: kind === 'simple' }), 'Investimento'));
      }
      case 'million': {
        const target = n(v, 'target'), rate = monthlyRate(n(v, 'annualRate'));
        let balance = initial, months = 0;
        const points = [{ label: 'Início', value: balance }];
        while (balance < target && months < 1200) {
          balance = balance * (1 + rate) + monthly; months++;
          if (months % 12 === 0 || balance >= target) points.push({ label: `${Math.ceil(months / 12)}º ano`, value: balance });
        }
        return result(balance >= target ? `Meta em aproximadamente ${months} meses` : 'Meta não atingida em 100 anos', balance >= target ? money(balance) : money(target), `${money(initial + monthly * months)} aportados · prazo estimado de ${Math.ceil(months / 12)} anos`, points, 'Projeção matemática, sem considerar inflação, impostos ou oscilações reais.', monthlyTable(projectMonthly(initial, monthly, rate, months), 'Investimento'));
      }
      case 'retirement': {
        const years = Math.max(0, n(v, 'retireAge') - n(v, 'age')), months = years * 12;
        const rate = monthlyRate(n(v, 'annualRate'));
        const projection = grow(n(v, 'initial'), n(v, 'monthly'), rate, months);
        const target = n(v, 'monthlyIncome') * 12 / 0.04;
        return result('Patrimônio projetado', money(projection.balance), `Meta ilustrativa: ${money(target)} · ${projection.balance >= target ? 'a projeção alcança' : 'a projeção fica abaixo de'} a meta`, projection.points, 'Meta calculada pela regra ilustrativa de retirada de 4% ao ano; não é garantia de renda ou retorno.', monthlyTable(projectMonthly(n(v, 'initial'), n(v, 'monthly'), rate, months), 'Investimento'));
      }
      case 'income': {
        const rate = monthlyRate(n(v, 'annualRate')), months = clampMonths(n(v, 'months'));
        const monthlyContribution = n(v, 'monthlyContribution');
        let balance = n(v, 'initial');
        const points = [{ label: 'Início', value: balance }];
        for (let m = 1; m <= months; m++) {
          balance = Math.max(0, balance * (1 + rate) + monthlyContribution - n(v, 'monthlyWithdrawal'));
          if (m % Math.max(1, Math.ceil(months / 10)) === 0 || m === months) points.push({ label: `${Math.ceil(m / 12)}º ano`, value: balance });
        }
        const runOut = points.findIndex(p => p.value === 0);
        return result('Saldo estimado ao final', money(balance), `${money(monthlyContribution)} de aporte e ${money(n(v, 'monthlyWithdrawal'))} de retirada mensal · ${runOut > 0 ? `saldo zerado por volta do ano ${points[runOut].label}` : 'saldo não zerou no período'}`, points, 'Considera taxa mensal equivalente, aporte e retirada recorrentes ao fim de cada mês; retirada limitada ao saldo disponível. Valores nominais.', monthlyTable(projectMonthly(n(v, 'initial'), monthlyContribution, rate, months, { withdrawal: n(v, 'monthlyWithdrawal') }), 'Investimento'));
      }
      case 'emergency': {
        const target = n(v, 'monthlyExpense') * n(v, 'reserveMonths'), saved = n(v, 'saved');
        return result('Meta para sua reserva', money(target), `${money(Math.max(0, target - saved))} faltam · ${target ? percent(Math.min(100, saved / target * 100)) : '0%'} da meta já acumulada`, [{ label: 'Já guardado', value: saved }, { label: 'Falta', value: Math.max(0, target - saved) }, { label: 'Meta', value: target }], 'A quantidade de meses é uma escolha pessoal; não há recomendação universal incluída.');
      }
      case 'fixed':
      case 'cdb': {
        const months = clampMonths(n(v, 'months'));
        const rateA = kind === 'cdb' ? n(v, 'annualRate') * n(v, 'cdiPercent') / 100 : n(v, 'rateA');
        const rateB = kind === 'cdb' ? 0 : n(v, 'rateB');
        const grossA = grow(initial, 0, monthlyRate(rateA), months).balance;
        const grossB = kind === 'cdb' ? 0 : grow(initial, 0, monthlyRate(rateB), months).balance;
        const taxFactor = 1 - n(v, 'taxRate') / 100;
        const netA = initial + (grossA - initial) * taxFactor;
        const netB = grossB;
        const monthlyA = projectMonthly(initial, 0, monthlyRate(rateA), months, { netFactor: taxFactor });
        const monthlyB = kind === 'cdb' ? null : projectMonthly(initial, 0, monthlyRate(rateB), months);
        const points = kind === 'cdb'
          ? [{ label: 'Investido', value: initial }, { label: 'Bruto', value: grossA }, { label: 'Líquido estimado', value: netA }]
          : [{ label: 'Aporte', value: initial }, { label: 'Cenário A líquido', value: netA }, { label: 'Cenário B', value: netB }];
        return result(kind === 'cdb' ? 'Valor líquido estimado do CDB' : 'Comparação no vencimento', money(netA), kind === 'cdb' ? `Valor bruto: ${money(grossA)} · rendimento líquido: ${money(netA - initial)}` : `Cenário A: ${money(netA)} · cenário B: ${money(netB)} · diferença: ${money(Math.abs(netA - netB))}`, points, 'Taxas informadas pelo usuário; não inclui taxas de custódia, inflação ou tributação específica de cada produto.', monthlyTable(monthlyA, kind === 'cdb' ? 'CDB líquido' : 'Cenário A', monthlyB, 'Cenário B'));
      }
      case 'two-rates': {
        const months = clampMonths(n(v, 'months'));
        const a = grow(initial, monthly, monthlyRate(n(v, 'rateA')), months);
        const b = grow(initial, monthly, monthlyRate(n(v, 'rateB')), months);
        const monthlyA = projectMonthly(initial, monthly, monthlyRate(n(v, 'rateA')), months);
        const monthlyB = projectMonthly(initial, monthly, monthlyRate(n(v, 'rateB')), months);
        return result('Cenário A ao final', money(a.balance), `Cenário B: ${money(b.balance)} · diferença: ${money(Math.abs(a.balance - b.balance))}`, [{ label: 'Cenário A', value: a.balance }, { label: 'Cenário B', value: b.balance }], 'Rentabilidades são hipóteses fornecidas pelo usuário, não previsões nem dados históricos.', monthlyTable(monthlyA, 'Cenário A', monthlyB, 'Cenário B'));
      }
      case 'rent-finance': {
        const months = clampMonths(n(v, 'years') * 12), property = n(v, 'property'), principal = Math.max(0, property - n(v, 'down'));
        const rate = monthlyRate(n(v, 'loanRate')), payment = rate ? principal * rate / (1 - Math.pow(1 + rate, -months)) : principal / months;
        const investment = monthlyRate(n(v, 'investmentRate')), monthlyDifference = payment - n(v, 'rent');
        const renterAssets = grow(n(v, 'down'), Math.max(0, monthlyDifference), investment, months).balance;
        const ownerSavings = grow(0, Math.max(0, -monthlyDifference), investment, months).balance;
        const homeValue = property * Math.pow(1 + n(v, 'appreciation') / 100, n(v, 'years'));
        const renterWealth = renterAssets;
        const ownerWealth = homeValue + ownerSavings;
        let renterBalance = n(v, 'down');
        let ownerProperty = property;
        let ownerBalance = 0;
        const propertyRate = monthlyRate(n(v, 'appreciation'));
        const renterMonthly = [];
        const ownerMonthly = [];
        let renterNetCashFlow = 0;
        let renterCumulativeProfit = 0;
        let ownerNetCashFlow = 0;
        let ownerCumulativeProfit = 0;
        for (let month = 1; month <= months; month++) {
          const renterOpeningBalance = renterBalance;
          const renterProfit = renterBalance * investment;
          const renterContribution = Math.max(0, monthlyDifference);
          renterBalance += renterProfit + renterContribution;
          renterNetCashFlow += renterContribution;
          renterCumulativeProfit += renterProfit;
          renterMonthly.push({
            month,
            balance: renterBalance,
            profit: renterProfit,
            returnPercent: renterOpeningBalance ? renterProfit / renterOpeningBalance * 100 : 0,
            deposit: renterContribution,
            withdrawal: 0,
            cumulativeResult: renterNetCashFlow + renterCumulativeProfit
          });

          const ownerOpeningWealth = ownerProperty + ownerBalance;
          const ownerSavingsProfit = ownerBalance * investment;
          const ownerContribution = Math.max(0, -monthlyDifference);
          const propertyProfit = ownerProperty * propertyRate;
          ownerProperty += propertyProfit;
          ownerBalance += ownerSavingsProfit + ownerContribution;
          ownerNetCashFlow += ownerContribution;
          ownerCumulativeProfit += propertyProfit + ownerSavingsProfit;
          const totalOwnerWealth = ownerProperty + ownerBalance;
          ownerMonthly.push({
            month,
            balance: totalOwnerWealth,
            profit: propertyProfit + ownerSavingsProfit,
            returnPercent: ownerOpeningWealth ? (propertyProfit + ownerSavingsProfit) / ownerOpeningWealth * 100 : 0,
            deposit: ownerContribution,
            withdrawal: 0,
            cumulativeResult: ownerNetCashFlow + ownerCumulativeProfit
          });
        }
        return result('Patrimônio estimado alugando', money(renterWealth), `Financiamento: parcela inicial de ${money(payment)} · patrimônio do imóvel e economias: ${money(ownerWealth)} · diferença: ${money(Math.abs(renterWealth - ownerWealth))}`, [{ label: 'Aluguel + investimento', value: renterWealth }, { label: 'Imóvel + economias', value: ownerWealth }], 'Comparação simplificada: não inclui custos de compra, manutenção, reajuste de aluguel, seguros ou amortização detalhada.', monthlyTable(renterMonthly, 'Aluguel + investimento', ownerMonthly, 'Imóvel + economias'));
      }
      case 'cash-installments': {
        const count = clampMonths(n(v, 'installments')), rate = monthlyRate(n(v, 'annualRate')), payment = n(v, 'installmentTotal') / count;
        const presentValue = rate ? payment * (1 - Math.pow(1 + rate, -count)) / rate : payment * count;
        const cash = n(v, 'cashPrice');
        return result(presentValue < cash ? 'Parcelar tem menor custo presente' : 'À vista tem menor custo presente', money(Math.min(presentValue, cash)), `À vista: ${money(cash)} · parcelas em valor presente: ${money(presentValue)} · total nominal parcelado: ${money(payment * count)}`, [{ label: 'À vista', value: cash }, { label: 'Parcelado (valor presente)', value: presentValue }], 'Parcelas consideradas iguais e mensais; o custo de oportunidade é a taxa informada.');
      }
      case 'pix': {
        const count = clampMonths(n(v, 'installments')), rate = n(v, 'monthlyRate') / 100, amount = n(v, 'purchase');
        const payment = rate ? amount * rate / (1 - Math.pow(1 + rate, -count)) : amount / count;
        return result('Valor estimado da parcela', money(payment), `Total: ${money(payment * count)} · juros estimados: ${money(payment * count - amount)}`, Array.from({ length: Math.min(count, 12) + 1 }, (_, i) => ({ label: i ? `Parcela ${i}` : 'Saldo inicial', value: i ? payment * (count - i + 1) : amount })), 'Parcelas fixas; sem tarifas adicionais. Consulte as condições reais do serviço.');
      }
      case 'mark-to-market': {
        const face = n(v, 'face'), years = Math.max(1, Math.round(n(v, 'years'))), coupon = face * n(v, 'couponRate') / 100;
        const price = rate => Array.from({ length: years }, (_, i) => coupon / Math.pow(1 + rate / 100, i + 1)).reduce((sum, value) => sum + value, 0) + face / Math.pow(1 + rate / 100, years);
        const before = price(n(v, 'oldRate')), after = price(n(v, 'newRate'));
        return result('Valor presente estimado', money(after), `Antes: ${money(before)} · variação: ${percent(before ? (after / before - 1) * 100 : 0)}`, [{ label: 'Taxa anterior', value: before }, { label: 'Nova taxa', value: after }], 'Título hipotético com cupons anuais constantes; não contempla impostos, risco de crédito ou características de títulos reais.');
      }
      case 'amortization': {
        const principal = n(v, 'principal'), months = clampMonths(n(v, 'months')), rate = monthlyRate(n(v, 'annualRate'));
        const pricePayment = rate ? principal * rate / (1 - Math.pow(1 + rate, -months)) : principal / months;
        const sacAmortization = principal / months;
        const first = v.system === 'sac' ? sacAmortization + principal * rate : pricePayment;
        const last = v.system === 'sac' ? sacAmortization + sacAmortization * rate : pricePayment;
        const total = v.system === 'sac' ? months * sacAmortization + rate * principal * (months + 1) / 2 : months * pricePayment;
        return result(`Primeira parcela (${v.system === 'sac' ? 'SAC' : 'Price'})`, money(first), `Última parcela estimada: ${money(last)} · total pago: ${money(total)} · juros: ${money(total - principal)}`, [{ label: 'Valor financiado', value: principal }, { label: 'Total pago', value: total }, { label: 'Juros', value: total - principal }], 'Taxa anual convertida em taxa mensal equivalente; parcelas sem seguros, tarifas ou correções monetárias.');
      }
      case 'pj': {
        const net = n(v, 'revenue') * (1 - n(v, 'taxRate') / 100) - n(v, 'expenses');
        return result('Renda líquida mensal estimada', money(net), `Faturamento: ${money(n(v, 'revenue'))} · impostos: ${money(n(v, 'revenue') * n(v, 'taxRate') / 100)} · despesas: ${money(n(v, 'expenses'))}`, [{ label: 'Faturamento', value: n(v, 'revenue') }, { label: 'Impostos', value: n(v, 'revenue') * n(v, 'taxRate') / 100 }, { label: 'Líquido', value: Math.max(0, net) }], 'Alíquota e despesas são informadas pelo usuário; não substitui apuração contábil ou tributária.');
      }
      case 'salary':
      case 'inss': {
        const gross = n(v, 'gross'), inss = gross * n(v, kind === 'inss' ? 'rate' : 'inssRate') / 100;
        const tax = kind === 'salary' ? gross * n(v, 'irRate') / 100 : 0;
        const net = gross - inss - tax - n(v, 'other');
        return result(kind === 'inss' ? 'Desconto estimado de INSS' : 'Salário líquido estimado', money(kind === 'inss' ? inss : net), kind === 'inss' ? `Alíquota efetiva aplicada: ${percent(n(v, 'rate'))}` : `INSS: ${money(inss)} · IR: ${money(tax)} · outros descontos: ${money(n(v, 'other'))}`, [{ label: 'Bruto', value: gross }, { label: 'Descontos', value: inss + tax + n(v, 'other') }, { label: 'Líquido', value: Math.max(0, net) }], 'Cálculo linear com alíquotas efetivas informadas; não aplica faixas, deduções ou limites legais.');
      }
      case 'clt-pj': {
        const clt = n(v, 'gross') * (1 - n(v, 'cltRate') / 100) + n(v, 'benefits');
        const pj = n(v, 'pjRevenue') * (1 - n(v, 'pjRate') / 100);
        return result('CLT líquido estimado + benefícios', money(clt), `PJ líquido estimado: ${money(pj)} · diferença: ${money(Math.abs(clt - pj))}`, [{ label: 'CLT + benefícios', value: clt }, { label: 'PJ líquido', value: pj }], 'Não monetiza férias, 13º, FGTS, previdência ou estabilidade; custos e impostos devem ser personalizados.');
      }
      case 'thirteenth': {
        const gross = n(v, 'salary') * Math.min(12, n(v, 'monthsWorked')) / 12;
        const net = gross * (1 - n(v, 'discountRate') / 100);
        return result('Valor bruto proporcional', money(gross), `Líquido aproximado: ${money(net)} · parcela mensal equivalente: ${money(gross / 12)}`, [{ label: 'Bruto', value: gross }, { label: 'Descontos', value: gross - net }, { label: 'Líquido', value: net }], 'Estimativa proporcional simplificada; regras de contagem, verbas e descontos podem variar.');
      }
      case 'vacation': {
        const base = n(v, 'salary') * Math.min(30, n(v, 'vacationDays')) / 30;
        const gross = base * 4 / 3, net = gross * (1 - n(v, 'discountRate') / 100);
        return result('Férias brutas estimadas', money(gross), `Salário proporcional + 1/3: ${money(gross)} · líquido aproximado: ${money(net)}`, [{ label: 'Remuneração base', value: base }, { label: 'Adicional de 1/3', value: base / 3 }, { label: 'Líquido estimado', value: net }], 'Estimativa simplificada sem venda de dias, médias variáveis ou cálculo legal de descontos.');
      }
      case 'employee-cost': {
        const salary = n(v, 'salary'), charges = salary * n(v, 'employerRate') / 100, provision = salary * n(v, 'provisionRate') / 100, total = salary + charges + provision + n(v, 'benefits');
        return result('Custo mensal estimado', money(total), `Salário: ${money(salary)} · encargos: ${money(charges)} · provisões: ${money(provision)} · benefícios: ${money(n(v, 'benefits'))}`, [{ label: 'Salário', value: salary }, { label: 'Encargos', value: charges }, { label: 'Provisões + benefícios', value: provision + n(v, 'benefits') }, { label: 'Total', value: total }], 'Percentuais são hipóteses editáveis; encargos variam por regime, setor e situação do empregador.');
      }
      case 'fgts': {
        const months = clampMonths(n(v, 'months')), deposit = n(v, 'salary') * n(v, 'depositRate') / 100;
        const rate = monthlyRate(n(v, 'annualRate'));
        const projection = grow(0, deposit, rate, months);
        return result('Saldo estimado do FGTS', money(projection.balance), `${money(deposit)} de depósito mensal · ${money(deposit * months)} depositados no período`, projection.points, 'Projeção simplificada com depósitos regulares e rendimento anual estimado informado.', monthlyTable(projectMonthly(0, deposit, rate, months), 'FGTS'));
      }
      case 'overtime': {
        const hourly = n(v, 'salary') / Math.max(1, n(v, 'monthlyHours')), total = hourly * n(v, 'overtimeHours') * (1 + n(v, 'premium') / 100);
        return result('Valor estimado das horas extras', money(total), `${n(v, 'overtimeHours')} horas · hora normal: ${money(hourly)} · adicional: ${percent(n(v, 'premium'))}`, [{ label: 'Hora normal', value: hourly }, { label: 'Horas extras', value: total }], 'Não considera reflexos em DSR, férias, 13º ou regras específicas de jornada.');
      }
      case 'unemployment': {
        const total = n(v, 'monthlyBenefit') * clampMonths(n(v, 'installments'));
        return result('Total estimado das parcelas', money(total), `${n(v, 'installments')} parcelas de ${money(n(v, 'monthlyBenefit'))} · média salarial informada: ${money(n(v, 'averageSalary'))}`, [{ label: 'Parcela mensal', value: n(v, 'monthlyBenefit') }, { label: 'Total estimado', value: total }], 'Valor e número de parcelas foram informados como estimativa; elegibilidade, faixas e limites legais não são calculados.');
      }
      case 'reality': {
        const reference = n(v, 'reference'), ratio = reference ? n(v, 'salary') / reference : 0;
        return result('Comparação com a referência informada', `${ratio.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}×`, `Sua renda: ${money(n(v, 'salary'))} · referência: ${money(reference)} · diferença: ${money(n(v, 'salary') - reference)}`, [{ label: 'Referência', value: reference }, { label: 'Sua renda', value: n(v, 'salary') }], 'Use uma fonte de referência confiável; este cálculo não estima percentil populacional.');
      }
      case 'income-tax': {
        const above = Math.max(0, n(v, 'salary') - n(v, 'threshold')), tax = above * n(v, 'rate') / 100;
        return result('Imposto mensal estimado acima do limite', money(tax), `${money(n(v, 'salary'))} de renda · limite considerado: ${money(n(v, 'threshold'))} · renda após estimativa: ${money(n(v, 'salary') - tax)}`, [{ label: 'Renda', value: n(v, 'salary') }, { label: 'Imposto estimado', value: tax }, { label: 'Após imposto', value: Math.max(0, n(v, 'salary') - tax) }], 'Limite e alíquota são editáveis; não reproduz tabela progressiva, deduções ou legislação fiscal.');
      }
      case 'termination': {
        const salary = n(v, 'salary'), gross = salary * n(v, 'daysWorked') / 30 + salary * n(v, 'monthsWorked') / 12 + salary / 3 * n(v, 'monthsWorked') / 12 + salary * n(v, 'noticeDays') / 30;
        const fine = n(v, 'fgtsBalance') * 0.4, total = gross + fine, net = total * (1 - n(v, 'discountRate') / 100);
        return result('Total bruto simplificado', money(total), `Verbas proporcionais estimadas: ${money(gross)} · multa hipotética de 40% sobre o FGTS informado: ${money(fine)} · após desconto estimado: ${money(net)}`, [{ label: 'Verbas estimadas', value: gross }, { label: 'Multa hipotética', value: fine }, { label: 'Líquido estimado', value: net }], 'Não determina modalidade de desligamento nem aplica todas as verbas, prazos, regras ou exceções legais.');
      }
      case 'cards': {
        const annualSpend = n(v, 'spend') * 12, a = annualSpend * n(v, 'cashbackA') / 100 - n(v, 'feeA'), b = annualSpend * n(v, 'cashbackB') / 100 - n(v, 'feeB');
        return result('Retorno líquido anual do cartão A', money(a), `Cartão B: ${money(b)} · diferença: ${money(Math.abs(a - b))}`, [{ label: 'Cartão A', value: a }, { label: 'Cartão B', value: b }], 'Somente os percentuais e custos informados são comparados; benefícios, limites e condições não são verificados.');
      }
      case 'days':
      case 'business-days': {
        const start = Date.parse(`${v.startDate}T00:00:00Z`), end = Date.parse(`${v.endDate}T00:00:00Z`);
        if (!Number.isFinite(start) || !Number.isFinite(end)) throw new Error('Informe datas válidas.');
        const direction = end >= start ? 1 : -1, days = Math.floor(Math.abs(end - start) / 86400000);
        let count = days;
        if (kind === 'business-days') {
          count = 0;
          for (let d = 1; d <= days; d++) {
            const weekday = new Date(start + direction * d * 86400000).getUTCDay();
            if (weekday !== 0 && weekday !== 6) count++;
          }
        }
        return result(kind === 'days' ? 'Dias corridos entre as datas' : 'Dias úteis entre as datas', `${count}`, `${days} dias corridos · ${kind === 'business-days' ? 'fins de semana excluídos; feriados não excluídos' : 'diferença entre as datas, sem incluir o dia inicial'}`, [{ label: 'Dias corridos', value: days }, { label: 'Resultado', value: count }], 'Para intervalos invertidos, é apresentada a diferença absoluta.');
      }
      case 'vehicle': {
        const km = n(v, 'km'), fuel = km / Math.max(0.01, n(v, 'fuelEfficiency')) * n(v, 'fuelPrice') + n(v, 'fuelMaintenance');
        const electric = km * n(v, 'electricEfficiency') / 100 * n(v, 'energyPrice') + n(v, 'electricMaintenance');
        return result('Custo anual a combustível', money(fuel), `Elétrico: ${money(electric)} · diferença anual: ${money(Math.abs(fuel - electric))}`, [{ label: 'Combustível + manutenção', value: fuel }, { label: 'Elétrico + manutenção', value: electric }], 'Estimativa de energia e manutenção; não inclui preço de compra, seguro, impostos ou depreciação.');
      }
      case 'fixed-costs': {
        const items = [['Moradia', n(v, 'housing')], ['Transporte', n(v, 'transport')], ['Alimentação', n(v, 'food')], ['Saúde', n(v, 'health')], ['Outros', n(v, 'other')]];
        const total = items.reduce((sum, item) => sum + item[1], 0);
        return result('Custos fixos mensais', money(total), `${percent(n(v, 'income') ? total / n(v, 'income') * 100 : 0)} da renda · saldo estimado: ${money(n(v, 'income') - total)}`, [...items.map(([label, value]) => ({ label, value })), { label: 'Renda', value: n(v, 'income') }], 'Categorias e valores informados pelo usuário; despesas variáveis não estão incluídas.');
      }
      default: throw new Error('Esta calculadora ainda não possui uma fórmula disponível.');
    }
  }

  function drawChart(svg, points) {
    const width = 720, height = 280, left = 64, right = 18, top = 22, bottom = 54;
    const values = points.map(point => point.value);
    const min = Math.min(...values, 0), max = Math.max(...values, 0) || 1;
    const plotWidth = width - left - right, plotHeight = height - top - bottom;
    const y = value => top + (max - value) / (max - min || 1) * plotHeight;
    const zeroY = y(0);
    const NS = 'http://www.w3.org/2000/svg';
    const make = (tag, attributes, text) => {
      const el = document.createElementNS(NS, tag);
      Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
      if (text !== undefined) el.textContent = text;
      return el;
    };
    svg.replaceChildren();
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `Gráfico de barras: ${points.map(p => `${p.label}, ${money(p.value)}`).join('; ')}`);
    for (let i = 0; i <= 4; i++) {
      const value = max - (max - min) * i / 4, lineY = y(value);
      svg.append(make('line', { x1: left, x2: width - right, y1: lineY, y2: lineY, stroke: value === 0 ? '#aab8af' : '#e8eee9' }));
      svg.append(make('text', { x: left - 8, y: lineY + 4, 'text-anchor': 'end', fill: '#728078', 'font-size': 11 }, money(value)));
    }
    const slot = plotWidth / points.length, barWidth = Math.min(58, slot * .58);
    points.forEach((point, index) => {
      const valueY = y(point.value), barTop = Math.min(zeroY, valueY), barHeight = Math.max(1, Math.abs(valueY - zeroY));
      const x = left + slot * index + (slot - barWidth) / 2;
      svg.append(make('rect', { x, y: barTop, width: barWidth, height: barHeight, rx: 5, fill: point.value < 0 ? '#c76955' : '#29905f' }));
      svg.append(make('text', { x: x + barWidth / 2, y: point.value < 0 ? Math.min(height - bottom - 4, valueY + 14) : Math.max(top + 12, valueY - 7), 'text-anchor': 'middle', fill: '#1c302c', 'font-size': 10 }, money(point.value)));
      const label = point.label.length > 18 ? `${point.label.slice(0, 16)}…` : point.label;
      svg.append(make('text', { x: x + barWidth / 2, y: height - bottom + 19, 'text-anchor': 'middle', fill: '#728078', 'font-size': 10 }, label));
    });
  }

  function createField(item) {
    const wrapper = document.createElement('label');
    wrapper.className = 'calculator-field';
    const title = document.createElement('span');
    title.textContent = item.label;
    wrapper.append(title);
    let input;
    if (item.unit === 'select') {
      input = document.createElement('select');
      item.options.forEach(([value, label]) => {
        const option = document.createElement('option');
        option.value = value; option.textContent = label; input.append(option);
      });
    } else {
      input = document.createElement('input');
      input.type = item.unit === 'date' ? 'date' : 'number';
      if (item.unit !== 'date') {
        input.min = item.min === undefined ? '0' : String(item.min);
        input.step = item.unit === 'percent' ? '0.01' : 'any';
        input.max = item.unit === 'percent' ? '1000'
          : item.unit === 'years' ? '100'
          : item.unit === 'count' ? '1000000'
          : '1000000000000';
      }
    }
    input.name = item.key;
    input.value = item.value;
    input.required = true;
    wrapper.append(input);
    return wrapper;
  }

  function renderCalculator(item) {
    const article = document.createElement('article');
    article.className = 'calculator-card';
    article.dataset.search = `${item.title} ${item.description}`.toLocaleLowerCase('pt-BR');
    article.id = `calculator-${item.id}`;
    article.setAttribute('role', 'tabpanel');
    article.setAttribute('aria-labelledby', `calculator-tab-${item.id}`);
    const icon = document.createElement('span');
    icon.className = 'calculator-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = item.icon;
    const content = document.createElement('span');
    content.className = 'calculator-card-copy';
    const title = document.createElement('strong');
    title.textContent = item.title;
    const description = document.createElement('span');
    description.textContent = item.description;
    content.append(title, description);
    const header = document.createElement('div');
    header.className = 'calculator-tab-header';
    header.append(icon, content);

    const panel = document.createElement('div');
    panel.className = 'calculator-panel';
    const form = document.createElement('form');
    form.className = 'calculator-form';
    form.noValidate = true;
    const fields = document.createElement('div');
    fields.className = 'calculator-fields';
    (schemas[item.kind] || []).forEach(config => fields.append(createField(config)));
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'calculator-submit';
    submit.textContent = 'Calcular resultado';
    form.append(fields, submit);
    const output = document.createElement('div');
    output.className = 'calculator-result';
    output.hidden = true;
    panel.append(form, output);
    article.append(header, panel);

    form.addEventListener('submit', event => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(form).entries());
      const invalid = [...form.querySelectorAll('input')].find(input =>
        !input.checkValidity() || (input.type === 'number' && !Number.isFinite(Number(input.value)))
      );
      if (invalid) {
        invalid.reportValidity();
        return;
      }
      try {
        const calculation = calculate(item.kind, values);
        output.replaceChildren();
        output.classList.remove('calculator-error');
        const summary = document.createElement('div');
        summary.className = 'calculator-result-summary';
        const heading = document.createElement('span');
        heading.textContent = calculation.title;
        const value = document.createElement('strong');
        value.textContent = calculation.value;
        const detail = document.createElement('p');
        detail.textContent = calculation.detail;
        summary.append(heading, value, detail);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('result-chart');
        drawChart(svg, calculation.points);
        output.append(summary, svg);
        if (calculation.monthly) {
          output.append(renderMonthlyTable(calculation.monthly));
        }
        const note = document.createElement('p');
        note.className = 'calculator-note';
        note.textContent = calculation.note;
        output.append(note);
        output.hidden = false;
      } catch (error) {
        output.hidden = false;
        output.textContent = error instanceof Error ? error.message : 'Não foi possível calcular com os valores informados.';
        output.classList.add('calculator-error');
      }
    });
    return article;
  }

  function renderMonthlyTable(monthly) {
    const section = document.createElement('section');
    section.className = 'monthly-results';
    const heading = document.createElement('h3');
    heading.textContent = 'Rentabilidade mês a mês';
    const description = document.createElement('p');
    description.className = 'monthly-results-description';
    description.textContent = 'O resultado acumulado soma aportes, subtrai retiradas e inclui todo o lucro/prejuízo gerado, mostrando a variação líquida em relação ao valor inicial.';
    const wrapper = document.createElement('div');
    wrapper.className = 'monthly-table-wrap';
    const table = document.createElement('table');
    table.className = 'monthly-table';
    const caption = document.createElement('caption');
    caption.textContent = 'Evolução estimada do investimento por mês';
    table.append(caption);

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    monthly.headers.forEach((label, index) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      if (index === 0) th.classList.add('monthly-period-column');
      headerRow.append(th);
    });
    thead.append(headerRow);
    const tbody = document.createElement('tbody');
    monthly.rows.forEach(row => {
      const tr = document.createElement('tr');
      const period = document.createElement('th');
      period.scope = 'row';
      period.textContent = row.period;
      tr.append(period);
      row.values.forEach((value, index) => {
        const cell = document.createElement('td');
        cell.textContent = monthly.percentColumns.includes(index)
          ? `${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
          : money(value);
        if (monthly.profitColumns.includes(index)) {
          cell.classList.add(value > 0 ? 'is-positive' : value < 0 ? 'is-negative' : 'is-neutral');
        }
        tr.append(cell);
      });
      tbody.append(tr);
    });
    table.append(thead, tbody);
    wrapper.append(table);
    section.append(heading, description, wrapper);
    return section;
  }

  function render() {
    const root = document.querySelector('#calculator-groups');
    const catalog = document.querySelector('#calculator-catalog');
    const search = document.querySelector('#calculator-search');
    const searchStatus = document.querySelector('#search-status');
    categories.forEach(category => {
      const section = document.createElement('section');
      section.className = 'calculator-group';
      section.id = category.id;
      section.setAttribute('aria-labelledby', `${category.id}-title`);
      const heading = document.createElement('div');
      heading.className = 'calculator-group-heading';
      const title = document.createElement('h3');
      title.id = `${category.id}-title`;
      title.textContent = category.title;
      const description = document.createElement('p');
      description.textContent = category.description;
      heading.append(title, description);
      const grid = document.createElement('div');
      grid.className = 'calculator-grid';
      const catalogSection = document.createElement('section');
      catalogSection.className = 'catalog-group';
      catalogSection.id = `catalog-${category.id}`;
      const catalogHeading = document.createElement('div');
      catalogHeading.className = 'catalog-group-heading';
      const catalogTitle = document.createElement('h2');
      catalogTitle.textContent = category.title;
      const catalogDescription = document.createElement('p');
      catalogDescription.textContent = category.description;
      catalogHeading.append(catalogTitle, catalogDescription);
      const catalogGrid = document.createElement('div');
      catalogGrid.className = 'catalog-grid';
      calculators.filter(item => item.category === category.id).forEach(item => {
        grid.append(renderCalculator(item));

        const card = document.createElement('article');
        card.className = 'catalog-card';
        card.dataset.search = `${item.title} ${item.description}`.toLocaleLowerCase('pt-BR');
        const tab = document.createElement('button');
        tab.className = 'catalog-card-button';
        tab.id = `calculator-tab-${item.id}`;
        tab.type = 'button';
        tab.setAttribute('aria-controls', `calculator-${item.id}`);
        const icon = document.createElement('span');
        icon.className = 'catalog-card-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = item.icon;
        const copy = document.createElement('span');
        copy.className = 'catalog-card-copy';
        const cardTitle = document.createElement('strong');
        cardTitle.textContent = item.title;
        const cardDescription = document.createElement('span');
        cardDescription.textContent = item.description;
        const arrow = document.createElement('span');
        arrow.className = 'catalog-card-arrow';
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '↗';
        copy.append(cardTitle, cardDescription);
        tab.append(icon, copy, arrow);
        tab.addEventListener('click', () => activate(item.id));
        card.append(tab);
        catalogGrid.append(card);
      });
      section.append(heading, grid);
      root.append(section);
      catalogSection.append(catalogHeading, catalogGrid);
      catalog.append(catalogSection);
    });
    const activate = id => {
      if (id && !calculators.some(item => item.id === id)) return;
      if (!document.querySelector('#portfolio-view').hidden) {
        document.querySelector('#portfolio-view').hidden = true;
        document.querySelector('.intro').hidden = false;
        document.querySelector('.calculator-hub').hidden = false;
        document.querySelector('.converter-intro').hidden = false;
        document.querySelector('#converter').hidden = false;
        document.querySelector('.explain').hidden = false;
      }
      const showWorkspace = Boolean(id);
      calculators.forEach(item => {
        const panel = document.querySelector(`#calculator-${item.id}`);
        const active = item.id === id;
        panel.hidden = !active;
        panel.setAttribute('aria-hidden', String(!active));
      });
      categories.forEach(category => {
        const section = document.querySelector(`#${category.id}`);
        section.hidden = !calculators.some(item => item.id === id && item.category === category.id);
      });
      root.hidden = !showWorkspace;
      catalog.hidden = showWorkspace;
      document.querySelector('#calculator-workspace-heading').hidden = !showWorkspace;
      document.querySelector('.calculator-disclaimer').hidden = showWorkspace;
      if (showWorkspace) {
        const activeCalculator = calculators.find(item => item.id === id);
        document.querySelector('#calculators-title').textContent = activeCalculator.title;
        search.value = '';
        searchStatus.textContent = '';
        catalog.querySelectorAll('.catalog-card').forEach(card => { card.hidden = false; });
        catalog.querySelectorAll('.catalog-group').forEach(section => { section.hidden = false; });
      }
    };
    const resetCatalog = () => {
      search.value = '';
      searchStatus.textContent = '';
      catalog.querySelectorAll('.catalog-card').forEach(card => { card.hidden = false; });
      catalog.querySelectorAll('.catalog-group').forEach(section => { section.hidden = false; });
    };
    document.querySelector('#back-to-catalog').addEventListener('click', () => {
      resetCatalog();
      activate(null);
    });
    search.addEventListener('input', () => {
      if (root.hidden) activate(null);
      const query = search.value.trim().toLocaleLowerCase('pt-BR');
      let totalVisible = 0;
      categories.forEach(category => {
        const section = document.querySelector(`#catalog-${category.id}`);
        let visible = 0;
        section.querySelectorAll('.catalog-card').forEach(card => {
          const matches = card.dataset.search.includes(query);
          card.hidden = !matches;
          if (matches) visible++;
        });
        section.hidden = visible === 0;
        totalVisible += visible;
      });
      searchStatus.textContent = query
        ? totalVisible ? `${totalVisible} calculadora${totalVisible === 1 ? '' : 's'} encontrada${totalVisible === 1 ? '' : 's'}. Selecione um cartão para abrir.`
          : 'Nenhuma calculadora encontrada. Tente outro termo.'
        : '';
    });
    search.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      const firstVisible = catalog.querySelector('.catalog-card:not([hidden]) .catalog-card-button');
      if (!firstVisible) return;
      event.preventDefault();
      firstVisible.click();
    });
    document.querySelectorAll('.market-strip a[href^="#catalog-"]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const category = link.hash.slice('#catalog-'.length);
        resetCatalog();
        activate(null);
        document.querySelector(`#catalog-${category}`).scrollIntoView({ behavior: 'smooth' });
      });
    });
    activate(null);
  }

  return { render };
})();

document.addEventListener('DOMContentLoaded', CalculatorHub.render, { once: true });
