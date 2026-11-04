/* Único arquivo que conhece os endereços da API. Sem chave ou cadastro. */
const CurrencyAPI = (() => {
  const BASE_URL = 'https://api.frankfurter.dev/v2';

  async function request(parameters, signal) {
    const response = await fetch(`${BASE_URL}/rates?${new URLSearchParams(parameters)}`, { signal });
    if (!response.ok) throw new Error(`Falha na API (${response.status}).`);
    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) throw new Error('Nenhuma cotação disponível.');
    if (rows.some(row => !/^\d{4}-\d{2}-\d{2}$/.test(row.date) || !Number.isFinite(row.rate) || row.rate <= 0)) {
      throw new Error('A API retornou dados inválidos.');
    }
    return rows.sort((a, b) => a.date.localeCompare(b.date));
  }

  return {
    async latest(base, quote, signal) {
      if (base === quote) return { date: new Date().toISOString().slice(0, 10), rate: 1 };
      const rows = await request({ base, quotes: quote }, signal);
      return rows[rows.length - 1];
    },
    async history(base, quote, days, signal) {
      const start = new Date();
      start.setUTCDate(start.getUTCDate() - days);
      if (base === quote) return [{ date: start.toISOString().slice(0, 10), rate: 1 }, { date: new Date().toISOString().slice(0, 10), rate: 1 }];
      return request({ base, quotes: quote, from: start.toISOString().slice(0, 10) }, signal);
    }
  };
})();
