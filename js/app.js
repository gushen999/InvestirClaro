/* Controlador da página: estado local, eventos e apresentação. */
const currencies = {
  EUR: 'Euro', BRL: 'Real brasileiro', USD: 'Dólar americano', GBP: 'Libra esterlina',
  JPY: 'Iene japonês', CHF: 'Franco suíço', CAD: 'Dólar canadense', AUD: 'Dólar australiano',
  CNY: 'Yuan chinês', ARS: 'Peso argentino', MXN: 'Peso mexicano', CLP: 'Peso chileno',
  UYU: 'Peso uruguaio', INR: 'Rúpia indiana', ZAR: 'Rand sul-africano', KRW: 'Won sul-coreano'
};
const $ = selector => document.querySelector(selector);
const state = { days: 30, rate: null, controller: null, request: 0 };
const format = value => value.toLocaleString('pt-BR', { maximumFractionDigits: 4 });
const formatDate = value => new Date(`${value}T12:00:00Z`).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

function convert(reverse = false) {
  if (state.rate === null) return;
  const source = $(reverse ? '#amount-to' : '#amount-from');
  const target = $(reverse ? '#amount-from' : '#amount-to');
  source.setCustomValidity('');
  if (source.value === '' || !source.validity.valid) { target.value = ''; return; }
  const value = Number(source.value);
  const result = reverse ? value / state.rate : value * state.rate;
  if (!Number.isFinite(result)) { source.setCustomValidity('Digite um valor menor.'); target.value = ''; source.reportValidity(); return; }
  target.value = Number(result.toFixed(6));
}

function resetHistory() {
  CurrencyChart.render([], '');
  $('#chart').setAttribute('aria-label', 'Histórico indisponível');
  $('#history-rows').replaceChildren();
  ['minimum', 'maximum', 'last'].forEach(id => $(`#${id}`).textContent = '—');
  $('#change').textContent = 'Histórico da cotação';
  $('#change').className = '';
}

function showHistory(rows, quote) {
  CurrencyChart.render(rows, quote);
  const values = rows.map(row => row.rate);
  $('#minimum').textContent = `${format(Math.min(...values))} ${quote}`;
  $('#maximum').textContent = `${format(Math.max(...values))} ${quote}`;
  $('#last').textContent = `${format(values[values.length - 1])} ${quote}`;
  const change = (values[values.length - 1] / values[0] - 1) * 100;
  $('#change').textContent = `${change >= 0 ? '+' : ''}${change.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}% no período`;
  $('#change').className = change >= 0 ? 'positive' : 'negative';
  $('#table-caption').textContent = `Valor de 1 ${$('#currency-from').value} em ${quote}`;
  const fragment = document.createDocumentFragment();
  [...rows].reverse().forEach(row => {
    const tr = document.createElement('tr');
    [formatDate(row.date), `${format(row.rate)} ${quote}`].forEach(value => {
      const td = document.createElement('td'); td.textContent = value; tr.append(td);
    }); fragment.append(tr);
  });
  $('#history-rows').replaceChildren(fragment);
}

async function load() {
  state.controller?.abort();
  state.controller = new AbortController();
  const requestId = ++state.request;
  const { signal } = state.controller;
  const base = $('#currency-from').value, quote = $('#currency-to').value;
  state.rate = null;
  $('#amount-to').value = '';
  $('#rate-value').textContent = '—';
  $('#base-label').textContent = `1 ${currencies[base]} equivale a`;
  $('#quote-name').textContent = currencies[quote];
  $('#pair').textContent = `${base} / ${quote}`;
  $('#updated').textContent = 'Consultando a fonte…';
  $('#notice').textContent = 'Buscando cotação e histórico…';
  $('#notice').className = 'notice';
  $('#refresh').disabled = true;
  $('#converter').setAttribute('aria-busy', 'true');
  resetHistory();
  $('#chart-empty').hidden = false;
  $('#chart-empty').textContent = 'Carregando histórico…';
  const results = await Promise.allSettled([
    CurrencyAPI.latest(base, quote, signal), CurrencyAPI.history(base, quote, state.days, signal)
  ]);
  if (requestId !== state.request) return;
  const [latest, history] = results;
  if (latest.status === 'fulfilled') {
    state.rate = latest.value.rate;
    $('#rate-value').textContent = format(state.rate);
    $('#updated').textContent = base === quote ? 'Mesma moeda: conversão de 1 para 1.' : `Cotação de ${formatDate(latest.value.date)} · Frankfurter`;
    convert();
  } else {
    $('#updated').textContent = 'Cotação indisponível';
  }
  if (history.status === 'fulfilled') {
    showHistory(history.value, quote);
    $('#chart-empty').hidden = true;
  } else {
    $('#chart-empty').textContent = 'Não foi possível carregar o histórico.';
  }
  const complete = results.every(result => result.status === 'fulfilled');
  $('#notice').className = complete ? 'notice' : 'notice error';
  $('#notice').textContent = complete
    ? (base === quote ? 'Você selecionou a mesma moeda nas duas opções.' : 'Dados diários de referência. Não são cotações em tempo real.')
    : latest.status === 'fulfilled' ? 'Conversão disponível. O histórico falhou; use “Atualizar cotação” para tentar novamente.'
    : 'Não foi possível obter a cotação. Verifique sua conexão e use “Atualizar cotação” para tentar novamente.';
  $('#refresh').disabled = false;
  $('#converter').setAttribute('aria-busy', 'false');
}

Object.entries(currencies).forEach(([code, name]) => {
  ['#currency-from', '#currency-to'].forEach(selector => {
    const option = document.createElement('option');
    option.value = code; option.textContent = `${code} · ${name}`; $(selector).append(option);
  });
});
$('#currency-from').value = 'EUR';
$('#currency-to').value = 'BRL';
$('#currency-from').addEventListener('change', load);
$('#currency-to').addEventListener('change', load);
$('#amount-from').addEventListener('input', () => convert());
$('#amount-to').addEventListener('input', () => convert(true));
$('#refresh').addEventListener('click', load);
$('#swap').addEventListener('click', () => {
  const previous = $('#currency-from').value;
  $('#currency-from').value = $('#currency-to').value;
  $('#currency-to').value = previous;
  load();
});
document.querySelectorAll('[data-days]').forEach(button => {
  button.addEventListener('click', () => {
    state.days = Number(button.dataset.days);
    document.querySelectorAll('[data-days]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));
    }); load();
  });
});
load();
