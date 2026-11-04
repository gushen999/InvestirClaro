/* Gráfico SVG com dica interativa; a tabela logo abaixo oferece os mesmos dados. */
const CurrencyChart = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const width = 600;
  const height = 280;
  const left = 58;
  const right = 16;
  const top = 18;
  const bottom = 35;

  function element(tag, attributes, text) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function render(rows, quote) {
    const svg = document.querySelector('#chart');
    const tooltip = document.querySelector('#chart-tooltip');
    const tooltipDate = document.querySelector('#chart-tooltip-date');
    const tooltipValue = document.querySelector('#chart-tooltip-value');
    const container = document.querySelector('#chart-container');
    svg.replaceChildren();
    tooltip.hidden = true;
    if (!rows.length) {
      svg.onpointermove = null;
      svg.onpointerleave = null;
      svg.onkeydown = null;
      svg.removeAttribute('aria-describedby');
      return;
    }

    const values = rows.map(row => row.rate);
    const min = Math.min(...values), max = Math.max(...values);
    const padding = (max - min) * .18 || max * .015;
    const lower = min - padding, upper = max + padding;
    const times = rows.map(row => Date.parse(`${row.date}T00:00:00Z`));
    const span = times[times.length - 1] - times[0] || 1;
    const x = i => left + (times[i] - times[0]) / span * (width - left - right);
    const y = value => top + (upper - value) / (upper - lower) * (height - top - bottom);
    const number = value => value.toLocaleString('pt-BR', { maximumFractionDigits: 4 });
    const date = value => new Date(`${value}T12:00:00Z`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

    const defs = element('defs', {});
    const gradient = element('linearGradient', { id: 'area-fill', x1: '0', y1: '0', x2: '0', y2: '1' });
    gradient.append(element('stop', { offset: '0%', 'stop-color': '#e2b600', 'stop-opacity': '.28' }), element('stop', { offset: '100%', 'stop-color': '#e2b600', 'stop-opacity': '0' }));
    defs.append(gradient);
    svg.append(defs);
    svg.setAttribute('aria-label', `Histórico em ${quote}. Mínima ${number(min)}, máxima ${number(max)}. Passe o cursor sobre o gráfico ou use as setas para consultar data e cotação. Consulte também a tabela abaixo.`);

    for (let i = 0; i < 4; i++) {
      const value = lower + (upper - lower) * i / 3;
      svg.append(element('line', { x1: left, x2: width - right, y1: y(value), y2: y(value), stroke: '#e8e5d8' }));
      svg.append(element('text', { x: left - 10, y: y(value) + 4, 'text-anchor': 'end', fill: '#77746b', 'font-size': 11 }, number(value)));
    }

    const path = rows.map((row, i) => `${i ? 'L' : 'M'}${x(i)},${y(row.rate)}`).join(' ');
    svg.append(element('path', { d: `${path} L${x(rows.length - 1)},${height - bottom} L${left},${height - bottom} Z`, fill: 'url(#area-fill)' }));
    svg.append(element('path', { d: path, fill: 'none', stroke: '#c6a000', 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));

    rows.forEach((row, i) => {
      const point = element('circle', { cx: x(i), cy: y(row.rate), r: i === rows.length - 1 ? 4 : 5, fill: '#c6a000', 'fill-opacity': i === rows.length - 1 ? 1 : 0 });
      point.append(element('title', {}, `${date(row.date)}: ${number(row.rate)} ${quote}`));
      svg.append(point);
    });

    const crosshair = element('line', { x1: left, x2: left, y1: top, y2: height - bottom, class: 'chart-crosshair', visibility: 'hidden' });
    const activePoint = element('circle', { cx: left, cy: top, r: 5, class: 'chart-active-point', visibility: 'hidden' });
    svg.append(crosshair, activePoint);

    [...new Set([0, Math.floor((rows.length - 1) / 2), rows.length - 1])].forEach(i => {
      svg.append(element('text', { x: x(i), y: height - 8, 'text-anchor': i === 0 ? 'start' : i === rows.length - 1 ? 'end' : 'middle', fill: '#77746b', 'font-size': 11 }, date(rows[i].date)));
    });

    let activeIndex = -1;
    const hideTooltip = () => {
      tooltip.hidden = true;
      crosshair.setAttribute('visibility', 'hidden');
      activePoint.setAttribute('visibility', 'hidden');
      svg.removeAttribute('aria-describedby');
      activeIndex = -1;
    };

    const showPoint = index => {
      activeIndex = Math.max(0, Math.min(rows.length - 1, index));
      const row = rows[activeIndex];
      const pointX = x(activeIndex);
      const pointY = y(row.rate);
      crosshair.setAttribute('x1', pointX);
      crosshair.setAttribute('x2', pointX);
      crosshair.setAttribute('visibility', 'visible');
      activePoint.setAttribute('cx', pointX);
      activePoint.setAttribute('cy', pointY);
      activePoint.setAttribute('visibility', 'visible');

      tooltipDate.textContent = date(row.date);
      tooltipValue.textContent = `${number(row.rate)} ${quote}`;
      tooltip.hidden = false;
      svg.setAttribute('aria-describedby', 'chart-tooltip');

      const svgRect = svg.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const pointScreenX = svgRect.left + pointX / width * svgRect.width;
      const pointScreenY = svgRect.top + pointY / height * svgRect.height;
      const tooltipLeft = Math.max(4, Math.min(
        pointScreenX - containerRect.left - tooltipRect.width / 2,
        containerRect.width - tooltipRect.width - 4
      ));
      const tooltipTop = Math.max(4, pointScreenY - containerRect.top - tooltipRect.height - 13);
      tooltip.style.left = `${tooltipLeft}px`;
      tooltip.style.top = `${tooltipTop}px`;
    };

    const nearestPoint = clientX => {
      const screenPoint = svg.createSVGPoint();
      screenPoint.x = clientX;
      screenPoint.y = svg.getBoundingClientRect().top + svg.getBoundingClientRect().height / 2;
      const graphX = screenPoint.matrixTransform(svg.getScreenCTM().inverse()).x;
      let nearest = 0;
      let nearestDistance = Infinity;
      for (let i = 0; i < rows.length; i++) {
        const distance = Math.abs(x(i) - graphX);
        if (distance < nearestDistance) {
          nearest = i;
          nearestDistance = distance;
        }
      }
      return nearest;
    };

    svg.onpointermove = event => {
      const screenPoint = svg.createSVGPoint();
      screenPoint.x = event.clientX;
      screenPoint.y = event.clientY;
      const graphPoint = screenPoint.matrixTransform(svg.getScreenCTM().inverse());
      if (graphPoint.y < top || graphPoint.y > height - bottom) {
        hideTooltip();
        return;
      }
      showPoint(nearestPoint(event.clientX));
    };
    svg.onpointerleave = hideTooltip;
    svg.onkeydown = event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0
        : event.key === 'End' ? rows.length - 1
          : activeIndex < 0 ? 0 : activeIndex + (event.key === 'ArrowRight' ? 1 : -1);
      showPoint(next);
    };
  }

  return { render };
})();
