/* Quotes and listed equities are provided by brapi.dev. */
const B3Market = (() => {
  const BASE_URL = 'https://brapi.dev/api/quote/list';
  let equities = [];
  let loadedAt = null;
  let inFlight = null;

  function parseEquities(payload) {
    if (!payload || !Array.isArray(payload.stocks)) {
      throw new Error('A fonte de mercado retornou uma resposta inválida.');
    }

    return payload.stocks
      .filter(stock => stock.type === 'stock' && /^[A-Z0-9]{4,6}$/.test(stock.stock) && !stock.stock.endsWith('F'))
      .filter(stock => Number.isFinite(stock.close) && stock.close > 0 && Number.isFinite(stock.change) && stock.change > -100)
      .map(stock => ({
        symbol: stock.stock,
        name: typeof stock.name === 'string' && stock.name.trim() ? stock.name.trim() : stock.stock,
        price: stock.close,
        changePercent: stock.change,
        sector: typeof stock.sector === 'string' ? stock.sector : ''
      }))
      .sort((a, b) => a.symbol.localeCompare(b.symbol));
  }

  async function load(force = false) {
    if (!force && equities.length && loadedAt && Date.now() - loadedAt < 60000) return equities;
    if (inFlight) return inFlight;

    inFlight = (async () => {
      let response;
      try {
        response = await fetch(BASE_URL, { cache: 'no-store' });
      } catch {
        throw new Error('Não foi possível conectar à fonte de cotações. Verifique a conexão e tente novamente.');
      }

      if (!response.ok) {
        if (response.status === 429) throw new Error('Limite temporário de consultas da fonte atingido. Aguarde e tente novamente.');
        throw new Error(`A fonte de cotações respondeu com erro (${response.status}).`);
      }

      const payload = await response.json();
      const nextEquities = parseEquities(payload);
      if (!nextEquities.length) throw new Error('A fonte não retornou ações disponíveis para a carteira.');

      equities = nextEquities;
      loadedAt = Date.now();
      document.dispatchEvent(new CustomEvent('b3:quotes-updated', { detail: { loadedAt } }));
      return equities;
    })();

    try {
      return await inFlight;
    } finally {
      inFlight = null;
    }
  }

  function search(query, limit = 12) {
    const term = query.trim().toLocaleUpperCase('pt-BR');
    if (!term) return [];
    return equities
      .filter(stock => stock.symbol.includes(term) || stock.name.toLocaleUpperCase('pt-BR').includes(term))
      .sort((a, b) => {
        const aExact = a.symbol === term ? 0 : a.symbol.startsWith(term) ? 1 : 2;
        const bExact = b.symbol === term ? 0 : b.symbol.startsWith(term) ? 1 : 2;
        return aExact - bExact || a.symbol.localeCompare(b.symbol);
      })
      .slice(0, limit);
  }

  function get(symbol) {
    return equities.find(stock => stock.symbol === symbol) || null;
  }

  function updatedAt() {
    return loadedAt ? new Date(loadedAt) : null;
  }

  return { load, search, get, updatedAt };
})();
