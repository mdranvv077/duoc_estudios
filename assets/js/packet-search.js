(() => {
  const input = document.querySelector('#packet-search-input');
  const results = document.querySelector('#packet-search-results');
  const status = document.querySelector('#packet-search-status');
  const categoryLinks = [...document.querySelectorAll('.category-grid .category-button[href]')];
  if (!input || !results || !status || !categoryLinks.length) return;

  const base = new URL('./', location.href);
  const normalize = (value) => value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const isLocalPage = (url) => url.origin === base.origin && url.pathname.startsWith(base.pathname) && url.pathname.endsWith('.html');
  const items = [];
  let loading;
  let expanded = false;

  async function readPage(url, category, categoryUrl, visited) {
    if (visited.has(url.href)) return;
    visited.add(url.href);
    try {
      const response = await fetch(url.href);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const documentCopy = new DOMParser().parseFromString(await response.text(), 'text/html');
      const article = documentCopy.querySelector('.lesson-content');
      if (!article) return;
      const heading = article.querySelector('h1')?.cloneNode(true);
      heading?.querySelectorAll('br').forEach((breakElement) => breakElement.replaceWith(' '));
      const title = clean(heading?.textContent) || clean(documentCopy.title);
      const lead = clean(article.querySelector('.lesson-lead')?.textContent);
      const blocks = [...article.querySelectorAll('h2, h3, p, li, pre')]
        .filter((element) => !element.closest('.lesson-actions, footer, nav'))
        .map((element) => clean(element.textContent))
        .filter(Boolean);
      items.push({ url: url.href, title, category, categoryUrl, lead, blocks,
        titleIndex: normalize(title), categoryIndex: normalize(category), bodyIndex: normalize(blocks.join(' ')) });

      // Los enlaces de navegación de cada módulo son la fuente del índice.
      // Una categoría o módulo nuevo entra en la búsqueda al enlazarlo en la guía.
      const nextPages = [...article.querySelectorAll('.lesson-actions a[href]')]
        .map((anchor) => new URL(anchor.getAttribute('href'), url))
        .filter((next) => isLocalPage(next) && next.pathname.startsWith(new URL('./', categoryUrl).pathname));
      for (const next of nextPages) await readPage(next, category, categoryUrl, visited);
    } catch (error) {
      console.warn('No se pudo indexar un módulo de Packet Tracer:', url.href, error);
    }
  }

  async function buildIndex() {
    status.textContent = 'Leyendo categorías y módulos…';
    const visited = new Set();
    await Promise.all(categoryLinks.map(async (link) => {
      const category = clean(link.querySelector('.category-name')?.textContent);
      const categoryUrl = new URL(link.getAttribute('href'), base);
      if (isLocalPage(categoryUrl)) await readPage(categoryUrl, category, categoryUrl, visited);
    }));
    const reference = document.querySelector('#reference-title + .category-button[href]');
    if (reference) {
      const url = new URL(reference.getAttribute('href'), base);
      if (isLocalPage(url)) await readPage(url, 'Referencia de comandos', url, visited);
    }
    render();
  }

  function start() {
    if (!loading) loading = buildIndex();
    return loading;
  }

  function excerpt(item, terms) {
    const phrase = terms.join(' ');
    const match = item.blocks.find((block) => normalize(block).includes(phrase)) ||
      item.blocks.find((block) => terms.every((term) => normalize(block).includes(term))) ||
      item.blocks.find((block) => terms.some((term) => normalize(block).includes(term)));
    const source = match || item.lead || item.blocks[0] || '';
    if (source.length <= 170) return source;
    const index = [phrase, ...terms].map((term) => normalize(source).indexOf(term)).find((position) => position >= 0) ?? 0;
    const from = Math.max(0, index - 45);
    return `${from ? '…' : ''}${source.slice(from, from + 170).trim()}${from + 170 < source.length ? '…' : ''}`;
  }

  function render() {
    results.replaceChildren();
    const query = clean(input.value);
    if (!query) {
      status.textContent = 'Escribe para buscar en los módulos de Packet Tracer.';
      expanded = false;
      return;
    }
    if (!items.length) {
      status.textContent = loading ? 'Leyendo categorías y módulos…' : 'No se pudo cargar el contenido de la guía.';
      return;
    }
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const phrase = terms.join(' ');
    const matches = items.map((item) => {
      if (!terms.every((term) => item.titleIndex.includes(term) || item.categoryIndex.includes(term) || item.bodyIndex.includes(term))) return null;
      const score = (item.titleIndex.includes(phrase) ? 12 : 0) +
        (item.bodyIndex.includes(phrase) ? 5 : 0) +
        terms.reduce((total, term) => total +
        (item.titleIndex.includes(term) ? 6 : 0) +
        (item.categoryIndex.includes(term) ? 3 : 0) +
        (item.bodyIndex.includes(term) ? 1 : 0), 0);
      return { item, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score || a.item.category.localeCompare(b.item.category, 'es'));
    status.textContent = matches.length ? `${matches.length} resultado${matches.length === 1 ? '' : 's'} para «${query}».` : `Sin resultados para «${query}». Prueba otra palabra o comando.`;
    for (const { item } of matches.slice(0, expanded ? matches.length : 12)) {
      const link = document.createElement('a');
      link.className = 'packet-search-result';
      link.href = item.url;
      const category = document.createElement('span');
      category.className = 'packet-search-category';
      category.textContent = item.category;
      const title = document.createElement('strong');
      title.textContent = item.title;
      const description = document.createElement('span');
      description.className = 'packet-search-excerpt';
      description.textContent = excerpt(item, terms);
      const arrow = document.createElement('span');
      arrow.className = 'packet-search-arrow';
      arrow.textContent = '↗';
      arrow.setAttribute('aria-hidden', 'true');
      link.append(category, title, description, arrow);
      results.append(link);
    }
    if (matches.length > 12 && !expanded) {
      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'packet-search-more';
      more.textContent = `Ver los ${matches.length - 12} resultados restantes`;
      more.addEventListener('click', () => { expanded = true; render(); });
      results.append(more);
    }
  }

  input.addEventListener('focus', start, { once: true });
  input.addEventListener('input', () => { expanded = false; start(); render(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName) && !document.activeElement?.isContentEditable) {
      event.preventDefault();
      input.focus();
    }
    if (event.key === 'Escape' && document.activeElement === input) input.blur();
  });
})();
