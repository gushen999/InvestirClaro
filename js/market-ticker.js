/* Continuous ticker for B3 quotes; no fallback prices are fabricated. */
(() => {
  const featuredSymbols = ['PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'BBAS3', 'WEGE3', 'ABEV3', 'B3SA3', 'RENT3', 'SUZB3'];

  function initialize() {
    const viewport = document.querySelector('#ticker-viewport');
    const track = document.querySelector('#ticker-track');
    const previous = document.querySelector('#ticker-previous');
    const next = document.querySelector('#ticker-next');
    const toggle = document.querySelector('#ticker-toggle');
    const status = document.querySelector('#ticker-updated');
    if (!viewport || !track || !previous || !next || !toggle || !status) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animation;
    let manuallyPaused = reducedMotion.matches;
    let interactionPaused = false;
    let initialized = false;
    let renderedCount = 0;
    let distance = 0;
    let duration = 0;

    const isPaused = () => manuallyPaused || interactionPaused || reducedMotion.matches;
    const updateToggle = () => {
      toggle.disabled = reducedMotion.matches;
      toggle.textContent = isPaused() ? '▶' : 'Ⅱ';
      toggle.setAttribute('aria-label', reducedMotion.matches
        ? 'Movimento automático desativado pela preferência de movimento reduzido'
        : isPaused() ? 'Retomar movimento do carrossel' : 'Pausar movimento do carrossel');
      toggle.setAttribute('aria-pressed', String(isPaused()));
    };

    const updatePlayback = () => {
      if (animation) {
        if (isPaused()) animation.pause();
        else animation.play();
      }
      updateToggle();
    };

    const createAnimation = progress => {
      animation?.cancel();
      const firstSet = [...track.children].slice(0, renderedCount);
      distance = firstSet.reduce((sum, card) => sum + card.getBoundingClientRect().width, 0);
      if (!distance) return;
      duration = distance / 42 * 1000;
      animation = track.animate(
        [{ transform: 'translate3d(0, 0, 0)' }, { transform: `translate3d(${-distance}px, 0, 0)` }],
        { duration, iterations: Infinity, easing: 'linear' }
      );
      animation.currentTime = progress * duration;
      updatePlayback();
    };

    const formatPrice = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formatPercent = value => `${value > 0 ? '+' : ''}${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
    const formatTime = date => date.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const renderQuotes = equities => {
      const featured = featuredSymbols.map(symbol => B3Market.get(symbol)).filter(Boolean);
      if (!featured.length) {
        status.textContent = 'Nenhuma cotação em destaque disponível neste momento.';
        return;
      }
      renderedCount = featured.length;
      track.replaceChildren();
      [...featured, ...featured].forEach((stock, index) => {
        const duplicate = index >= featured.length;
        const card = document.createElement('article');
        card.className = 'ticker-asset';
        if (duplicate) card.setAttribute('aria-hidden', 'true');
        const heading = document.createElement('div');
        heading.className = 'ticker-asset-heading';
        const symbol = document.createElement('strong');
        symbol.textContent = stock.symbol;
        const variation = document.createElement('span');
        variation.className = stock.changePercent > 0 ? 'ticker-positive' : stock.changePercent < 0 ? 'ticker-negative' : '';
        variation.textContent = formatPercent(stock.changePercent);
        const price = document.createElement('span');
        price.className = 'ticker-asset-price';
        price.textContent = formatPrice(stock.price);
        const company = document.createElement('small');
        company.textContent = stock.name;
        heading.append(symbol, variation);
        card.append(heading, price, company);
        track.append(card);
      });

      const updatedAt = B3Market.updatedAt();
      status.textContent = updatedAt
        ? `Preço de fechamento e variação informados pela brapi.dev · consulta às ${formatTime(updatedAt)}`
        : 'Preços e variações informados pela brapi.dev';

      if (!initialized) {
        initialized = true;
        createAnimation(0);
      } else {
        const progress = duration ? (Number(animation?.currentTime) || 0) % duration / duration : 0;
        createAnimation(progress);
      }
    };

    const showLoadError = error => {
      status.textContent = error instanceof Error ? error.message : 'Não foi possível carregar as cotações.';
    };

    previous.addEventListener('click', () => {
      if (!animation || !duration) return;
      const width = track.children[0]?.getBoundingClientRect().width || 170;
      animation.currentTime = ((Number(animation.currentTime) - width / 42 * 1000) % duration + duration) % duration;
    });
    next.addEventListener('click', () => {
      if (!animation || !duration) return;
      const width = track.children[0]?.getBoundingClientRect().width || 170;
      animation.currentTime = ((Number(animation.currentTime) + width / 42 * 1000) % duration + duration) % duration;
    });
    toggle.addEventListener('click', () => {
      if (reducedMotion.matches) return;
      manuallyPaused = !manuallyPaused;
      updatePlayback();
    });

    viewport.addEventListener('pointerenter', () => {
      interactionPaused = true;
      updatePlayback();
    });
    viewport.addEventListener('pointerleave', () => {
      interactionPaused = false;
      updatePlayback();
    });
    viewport.addEventListener('focusin', () => {
      interactionPaused = true;
      updatePlayback();
    });
    viewport.addEventListener('focusout', event => {
      if (!viewport.contains(event.relatedTarget)) {
        interactionPaused = false;
        updatePlayback();
      }
    });
    viewport.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') next.click();
      if (event.key === 'ArrowLeft') previous.click();
    });

    window.addEventListener('resize', () => {
      const progress = duration ? (Number(animation?.currentTime) || 0) % duration / duration : 0;
      createAnimation(progress);
    });
    reducedMotion.addEventListener('change', event => {
      manuallyPaused = event.matches;
      updatePlayback();
    });

    document.addEventListener('b3:quotes-updated', () => {
      renderQuotes([]);
    });
    B3Market.load().catch(showLoadError);
  }

  document.addEventListener('DOMContentLoaded', initialize, { once: true });
})();
