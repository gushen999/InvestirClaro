/* Locally stored portfolio; personal holdings never leave this browser. */
(() => {
  const STORAGE_KEY = 'investir-claro-portfolio-v1';
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const number = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 });

  function initialize() {
    const view = document.querySelector('#portfolio-view');
    const form = document.querySelector('#portfolio-form');
    if (!view || !form) return;

    const search = document.querySelector('#stock-search');
    const results = document.querySelector('#stock-search-results');
    const selectedLabel = document.querySelector('#portfolio-selected');
    const quantityInput = document.querySelector('#stock-quantity');
    const averageInput = document.querySelector('#stock-average');
    const addButton = document.querySelector('#add-stock');
    const notice = document.querySelector('#portfolio-notice');
    const tableRows = document.querySelector('#holdings-rows');
    const chart = document.querySelector('#portfolio-chart');
    const chartEmpty = document.querySelector('#portfolio-chart-empty');
    let holdings = [];
    let selectedStock = null;
    let searchTimer;
    let storageWarning = '';

    const setNotice = (message, isError = false) => {
      notice.textContent = message;
      notice.classList.toggle('is-error', isError);
    };

    const validHolding = holding => holding
      && typeof holding.symbol === 'string'
      && /^[A-Z0-9]{4,6}$/.test(holding.symbol)
      && typeof holding.name === 'string'
      && Number.isFinite(holding.quantity)
      && holding.quantity > 0
      && Number.isFinite(holding.averagePrice)
      && holding.averagePrice > 0
      && Number.isFinite(holding.quantity * holding.averagePrice);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed) || !parsed.every(validHolding)) {
          storageWarning = 'Os dados salvos da carteira são inválidos. Eles foram mantidos sem alteração; revise ou remova-os no armazenamento local.';
          setNotice(storageWarning, true);
        } else {
          holdings = parsed;
        }
      }
    } catch (error) {
      storageWarning = `Não foi possível ler a carteira salva neste navegador: ${error.message}`;
      setNotice(storageWarning, true);
    }

    const saveHoldings = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
        return true;
      } catch (error) {
        setNotice(`Não foi possível salvar a carteira neste navegador: ${error.message}`, true);
        return false;
      }
    };

    const closeResults = () => {
      results.hidden = true;
      search.setAttribute('aria-expanded', 'false');
    };

    const chooseStock = stock => {
      selectedStock = stock;
      search.value = stock.symbol;
      selectedLabel.textContent = `${stock.symbol} — ${stock.name} · último fechamento ${money.format(stock.price)}`;
      addButton.disabled = false;
      closeResults();
      averageInput.focus();
    };

    const showResults = matches => {
      results.replaceChildren();
      if (!matches.length) {
        const empty = document.createElement('p');
        empty.className = 'stock-search-empty';
        empty.textContent = B3Market.search(search.value).length ? 'Nenhum resultado encontrado.' : 'Nenhuma ação correspondente. Confira a busca ou atualize as cotações.';
        results.append(empty);
        results.hidden = false;
        search.setAttribute('aria-expanded', 'true');
        return;
      }

      matches.forEach(stock => {
        const option = document.createElement('button');
        option.className = 'stock-option';
        option.type = 'button';
        option.role = 'option';
        option.setAttribute('aria-selected', 'false');
        const symbol = document.createElement('strong');
        symbol.textContent = stock.symbol;
        const name = document.createElement('span');
        name.textContent = stock.name;
        const price = document.createElement('small');
        price.textContent = money.format(stock.price);
        option.append(symbol, name, price);
        option.addEventListener('click', () => chooseStock(stock));
        results.append(option);
      });
      results.hidden = false;
      search.setAttribute('aria-expanded', 'true');
    };

    const renderSearchResults = () => {
      selectedStock = null;
      selectedLabel.textContent = 'Nenhuma ação selecionada';
      addButton.disabled = true;
      const query = search.value.trim();
      if (!query) {
        closeResults();
        return;
      }
      showResults(B3Market.search(query));
    };

    const renderChart = rows => {
      chart.replaceChildren();
      const plotted = rows.filter(row => row.stock && Number.isFinite(row.pnl));
      chartEmpty.hidden = plotted.length > 0;
      chart.hidden = plotted.length === 0;
      if (!plotted.length) return;

      const width = 820;
      const rowHeight = 42;
      const height = Math.max(110, plotted.length * rowHeight + 30);
      const labelWidth = 100;
      const rightPadding = 105;
      const plotWidth = width - labelWidth - rightPadding;
      const maxAbs = Math.max(...plotted.map(row => Math.abs(row.pnl)), 1);
      const baseline = labelWidth + plotWidth / 2;
      chart.setAttribute('viewBox', `0 0 ${width} ${height}`);
      chart.setAttribute('aria-label', `Gráfico de lucro e prejuízo por ação, ${plotted.length} ativos`);

      const baselineLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      baselineLine.setAttribute('x1', baseline);
      baselineLine.setAttribute('x2', baseline);
      baselineLine.setAttribute('y1', '8');
      baselineLine.setAttribute('y2', String(height - 8));
      baselineLine.setAttribute('class', 'portfolio-chart-baseline');
      chart.append(baselineLine);

      plotted.forEach((row, index) => {
        const centerY = 24 + index * rowHeight;
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', '8');
        label.setAttribute('y', String(centerY + 4));
        label.setAttribute('class', 'portfolio-chart-label');
        label.textContent = row.holding.symbol;
        chart.append(label);

        const barWidth = Math.max(2, Math.abs(row.pnl) / maxAbs * (plotWidth / 2 - 8));
        const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bar.setAttribute('x', String(row.pnl >= 0 ? baseline : baseline - barWidth));
        bar.setAttribute('y', String(centerY - 9));
        bar.setAttribute('width', String(barWidth));
        bar.setAttribute('height', '18');
        bar.setAttribute('rx', '4');
        bar.setAttribute('class', row.pnl >= 0 ? 'portfolio-bar-positive' : 'portfolio-bar-negative');
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${row.holding.symbol}: ${money.format(row.pnl)}`;
        bar.append(title);
        chart.append(bar);

        const amount = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        amount.setAttribute('x', String(row.pnl >= 0 ? baseline + barWidth + 7 : baseline - barWidth - 7));
        amount.setAttribute('y', String(centerY + 4));
        amount.setAttribute('text-anchor', row.pnl >= 0 ? 'start' : 'end');
        amount.setAttribute('class', `portfolio-chart-value ${row.pnl >= 0 ? 'is-positive' : 'is-negative'}`);
        amount.textContent = money.format(row.pnl);
        chart.append(amount);
      });
    };

    const render = () => {
      const rows = holdings.map(holding => {
        const stock = B3Market.get(holding.symbol);
        const invested = holding.quantity * holding.averagePrice;
        const value = stock ? holding.quantity * stock.price : null;
        return { holding, stock, invested, value, pnl: stock ? value - invested : null };
      });
      const quotedRows = rows.filter(row => row.stock);
      const totalInvested = rows.reduce((sum, row) => sum + row.invested, 0);
      const totalValue = quotedRows.reduce((sum, row) => sum + row.value, 0);
      const totalPnl = quotedRows.reduce((sum, row) => sum + row.pnl, 0);
      const previousValue = quotedRows.reduce((sum, row) => {
        const previousPrice = row.stock.price / (1 + row.stock.changePercent / 100);
        return sum + row.holding.quantity * previousPrice;
      }, 0);
      const dailyPnl = quotedRows.reduce((sum, row) => {
        const previousPrice = row.stock.price / (1 + row.stock.changePercent / 100);
        return sum + row.holding.quantity * (row.stock.price - previousPrice);
      }, 0);
      const dailyPercent = previousValue ? dailyPnl / previousValue * 100 : 0;

      document.querySelector('#portfolio-value').textContent = quotedRows.length || !holdings.length ? money.format(totalValue) : '—';
      document.querySelector('#portfolio-invested').textContent = money.format(totalInvested);
      const pnlElement = document.querySelector('#portfolio-pnl');
      pnlElement.textContent = quotedRows.length || !holdings.length ? money.format(totalPnl) : '—';
      pnlElement.classList.toggle('is-positive', totalPnl > 0);
      pnlElement.classList.toggle('is-negative', totalPnl < 0);
      const dailyElement = document.querySelector('#portfolio-daily');
      dailyElement.textContent = quotedRows.length || !holdings.length
        ? `${dailyPercent > 0 ? '+' : ''}${dailyPercent.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
        : '—';
      dailyElement.classList.toggle('is-positive', dailyPercent > 0);
      dailyElement.classList.toggle('is-negative', dailyPercent < 0);

      tableRows.replaceChildren();
      rows.forEach(row => {
        const tr = document.createElement('tr');
        const values = [
          [row.holding.symbol, ''],
          [number.format(row.holding.quantity), ''],
          [money.format(row.holding.averagePrice), ''],
          [row.stock ? money.format(row.stock.price) : 'Indisponível', ''],
          [row.stock ? money.format(row.value) : '—', ''],
          [row.stock ? money.format(row.pnl) : '—', row.pnl > 0 ? 'is-positive' : row.pnl < 0 ? 'is-negative' : '']
        ];
        values.forEach(([text, className], index) => {
          const cell = document.createElement(index === 0 ? 'th' : 'td');
          if (index === 0) cell.scope = 'row';
          cell.textContent = text;
          if (className) cell.classList.add(className);
          if (index === 0 && row.holding.name) {
            const name = document.createElement('small');
            name.textContent = row.holding.name;
            cell.append(name);
          }
          tr.append(cell);
        });
        const actionCell = document.createElement('td');
        const remove = document.createElement('button');
        remove.className = 'holding-remove';
        remove.type = 'button';
        remove.textContent = 'Remover';
        remove.setAttribute('aria-label', `Remover ${row.holding.symbol} da carteira`);
        remove.addEventListener('click', () => {
          const nextHoldings = holdings.filter(item => item.symbol !== row.holding.symbol);
          const previousHoldings = holdings;
          holdings = nextHoldings;
          if (saveHoldings()) render();
          else holdings = previousHoldings;
        });
        actionCell.append(remove);
        tr.append(actionCell);
        tableRows.append(tr);
      });

      const count = holdings.length;
      document.querySelector('#holdings-count').textContent = count
        ? `${count} ativo${count === 1 ? '' : 's'}${quotedRows.length < count ? ` · ${count - quotedRows.length} cotação(ões) indisponível(is)` : ''}`
        : 'Nenhuma ação adicionada';
      renderChart(rows);
    };

    search.addEventListener('input', () => {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(renderSearchResults, 160);
    });
    search.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeResults();
      if (event.key === 'ArrowDown' && !results.hidden) {
        event.preventDefault();
        results.querySelector('button')?.focus();
      }
    });
    search.addEventListener('focus', () => {
      if (!selectedStock && search.value.trim() && B3Market.search(search.value).length) renderSearchResults();
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.portfolio-search-wrap')) closeResults();
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      const quantity = Number(quantityInput.value);
      const averagePrice = Number(averageInput.value);
      if (!selectedStock || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(averagePrice) || averagePrice <= 0) {
        setNotice('Selecione uma ação e informe quantidade e preço médio maiores que zero.', true);
        return;
      }

      const existing = holdings.find(holding => holding.symbol === selectedStock.symbol);
      const nextQuantity = quantity + (existing?.quantity || 0);
      const totalCost = (existing?.quantity || 0) * (existing?.averagePrice || 0) + quantity * averagePrice;
      const nextAverage = totalCost / nextQuantity;
      if (!Number.isFinite(nextQuantity) || !Number.isFinite(totalCost) || !Number.isFinite(nextAverage)
        || !Number.isFinite(nextQuantity * nextAverage) || !Number.isFinite(nextQuantity * selectedStock.price)) {
        setNotice('A quantidade e o preço informados excedem os limites numéricos aceitos.', true);
        return;
      }
      const nextHolding = { symbol: selectedStock.symbol, name: selectedStock.name, quantity: nextQuantity, averagePrice: nextAverage };
      const previousHoldings = holdings;
      holdings = existing
        ? holdings.map(holding => holding.symbol === nextHolding.symbol ? nextHolding : holding)
        : [...holdings, nextHolding];
      if (!saveHoldings()) {
        holdings = previousHoldings;
        return;
      }
      storageWarning = '';

      render();
      selectedStock = null;
      search.value = '';
      selectedLabel.textContent = 'Nenhuma ação selecionada';
      quantityInput.value = '1';
      averageInput.value = '';
      addButton.disabled = true;
      closeResults();
      search.focus();
      setNotice(`${nextHolding.symbol} ${existing ? 'atualizada' : 'adicionada'} à carteira. Os dados ficam somente neste navegador.`);
    });

    document.querySelector('#refresh-portfolio').addEventListener('click', async event => {
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = 'Atualizando…';
      try {
        await B3Market.load(true);
        render();
        const updatedAt = B3Market.updatedAt();
        setNotice(`Cotações consultadas às ${updatedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. A fonte pode apresentar atraso em relação ao mercado.`);
      } catch (error) {
        setNotice(error.message, true);
      } finally {
        button.disabled = false;
        button.textContent = 'Atualizar cotações';
      }
    });

    document.addEventListener('b3:quotes-updated', () => {
      render();
      if (view.hidden) return;
      const updatedAt = B3Market.updatedAt();
      setNotice(storageWarning || `Cotações da brapi.dev consultadas às ${updatedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. Valores podem ter atraso.`, Boolean(storageWarning));
    });

    const showPortfolio = event => {
      event.preventDefault();
      document.querySelector('.intro').hidden = true;
      document.querySelector('.calculator-hub').hidden = true;
      document.querySelector('.converter-intro').hidden = true;
      document.querySelector('#converter').hidden = true;
      document.querySelector('.explain').hidden = true;
      view.hidden = false;
      view.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    document.querySelector('#portfolio-nav').addEventListener('click', showPortfolio);
    document.querySelectorAll('.market-strip a[href^="#catalog-"]').forEach(link => {
      link.addEventListener('click', () => {
        view.hidden = true;
        document.querySelector('.intro').hidden = false;
        document.querySelector('.calculator-hub').hidden = false;
        document.querySelector('.converter-intro').hidden = false;
        document.querySelector('#converter').hidden = false;
        document.querySelector('.explain').hidden = false;
      });
    });

    render();
    B3Market.load().then(() => {
      render();
      if (storageWarning) setNotice(storageWarning, true);
      else if (view.hidden) setNotice('Cotações disponíveis. Adicione uma ação para acompanhar sua carteira.');
    }).catch(error => setNotice(error.message, true));
  }

  document.addEventListener('DOMContentLoaded', initialize, { once: true });
})();
