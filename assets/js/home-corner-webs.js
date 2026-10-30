(() => {
  const holder = document.querySelector('[data-home-corner-webs]');
  if (!holder) return;

  // Each variant keeps a radial structure. Shape, spacing, and gaps vary.
  const designs = [
    { width: 190, height: 190, spokes: 8, rings: 5, reach: 228, sag: .88 },
    { width: 286, height: 170, spokes: 10, rings: 6, reach: 245, sag: .91, spread: .94 },
    { width: 174, height: 254, spokes: 9, rings: 6, reach: 246, sag: .89, spread: 1.04 },
    { width: 265, height: 210, spokes: 9, rings: 5, reach: 235, sag: .90, hub: [12, 8] },
    { width: 219, height: 192, spokes: 10, rings: 6, reach: 243, sag: .87, gaps: [[2, 5], [4, 1], [5, 7]] },
    { width: 244, height: 237, spokes: 8, rings: 7, reach: 248, sag: .92, irregular: true },
  ];
  const first = Math.floor(Math.random() * designs.length);
  const second = (first + 1 + Math.floor(Math.random() * (designs.length - 1))) % designs.length;
  const coords = point => `${point[0].toFixed(1)} ${point[1].toFixed(1)}`;
  const angleFor = (config, i) => {
    const fraction = i / (config.spokes - 1);
    const shift = config.irregular && i > 0 && i < config.spokes - 1
      ? Math.sin(i * 3.7) * .012 : 0;
    return (fraction + shift) * Math.PI / 2 * (config.spread || 1);
  };

  function web(config, side) {
    const [hx, hy] = config.hub || [-5, -5];
    const paths = [];
    const angles = Array.from({ length: config.spokes }, (_, i) => angleFor(config, i));
    const point = (radius, angle) => [hx + Math.cos(angle) * radius, hy + Math.sin(angle) * radius];

    angles.forEach(angle => {
      paths.push(`<path class="web-spoke" d="M${coords([hx, hy])}L${coords(point(315, angle))}"/>`);
    });

    for (let ring = 0; ring < config.rings; ring++) {
      const radius = config.reach * (ring + 1) / config.rings;
      for (let spoke = 0; spoke < angles.length - 1; spoke++) {
        if (config.gaps?.some(([r, s]) => r === ring && s === spoke)) continue;
        const start = point(radius, angles[spoke]);
        const end = point(radius, angles[spoke + 1]);
        const middle = point(radius * config.sag, (angles[spoke] + angles[spoke + 1]) / 2);
        paths.push(`<path class="web-ring" d="M${coords(start)}Q${coords(middle)} ${coords(end)}"/>`);
      }
    }

    return `<svg class="web-${side}" style="--web-width:${config.width}px;--web-height:${config.height}px" viewBox="0 0 250 250" preserveAspectRatio="none" aria-hidden="true">${paths.join('')}</svg>`;
  }

  holder.innerHTML = web(designs[first], 'left') + web(designs[second], 'right');

  function firstLetter(selector) {
    const element = document.querySelector(selector);
    const text = [...(element?.childNodes || [])].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (!text) return null;
    const index = text.textContent.search(/\S/);
    const range = document.createRange();
    range.setStart(text, index);
    range.setEnd(text, index + 1);
    return range.getBoundingClientRect();
  }

  function attachToLetters() {
    holder.querySelector('.web-attachments')?.remove();
    const bounds = holder.getBoundingClientRect();
    const webBounds = holder.querySelector('.web-left').getBoundingClientRect();
    const brand = firstLetter('.brand span');
    const heading = firstLetter('.hero h1');
    if (!brand || !heading) return;

    const config = designs[first];
    const [hx, hy] = config.hub || [-5, -5];
    const edgePoint = spoke => {
      const angle = angleFor(config, spoke);
      return [
        webBounds.left - bounds.left + (hx + Math.cos(angle) * config.reach) * webBounds.width / 250,
        webBounds.top - bounds.top + (hy + Math.sin(angle) * config.reach) * webBounds.height / 250,
      ];
    };
    const fromBrand = edgePoint(1);
    const fromHeading = edgePoint(Math.round((config.spokes - 1) * .45));
    const toBrand = [brand.left - bounds.left + 1, brand.top - bounds.top + brand.height * .55];
    const toHeading = [heading.left - bounds.left + 2, heading.top - bounds.top + heading.height * .38];
    // On narrower screens the web already reaches the content, so no extra strands are needed.
    if (toBrand[0] - fromBrand[0] < 35 || toHeading[0] - fromHeading[0] < 65) return;
    const links = [[fromBrand, toBrand], [fromHeading, toHeading]]
      .map(([from, to]) => `<path class="web-anchor" d="M${coords(from)}L${coords(to)}"/>`);
    holder.insertAdjacentHTML('beforeend', `<svg class="web-attachments" viewBox="0 0 ${bounds.width} ${bounds.height}" preserveAspectRatio="none" aria-hidden="true">${links.join('')}</svg>`);
  }

  window.addEventListener('resize', attachToLetters);
  document.fonts?.ready.then(attachToLetters);
  attachToLetters();
})();
