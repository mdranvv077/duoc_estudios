const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/js/cableado.js'), 'utf8');
const context = {};
vm.runInNewContext(source.slice(0, source.indexOf('document.addEventListener')) + '\nthis.catalog={cabCategories,modelHtml,pins,fault,standardLinks};', context);
const {cabCategories:categories,modelHtml,pins,fault,standardLinks} = context.catalog;
const folders = ['el-cable','componentes','terminacion','recorridos','administracion','pruebas'];
const names = [
  ['index.html','anatomia.html','categorias.html','blindajes.html'],
  ['index.html','rack.html','cordones.html'],
  ['index.html','canal.html','compatibilidad.html'],
  ['index.html','backbone.html','canalizaciones.html'],
  ['index.html','puesta-a-tierra.html','entrega.html'],
  ['index.html','fallas.html','certificacion.html']
];
const out = path.join(root,'guias/cableado-estructurado');
function esc(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}
function head(title, depth){const up='../'.repeat(depth);return `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${esc(title)} · Guía de cableado estructurado y pares trenzados."><title>${esc(title)}${depth===2?'':' — Cableado estructurado'}</title><link rel="icon" type="image/png" href="${up}img/favicon.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet"><script src="${up}assets/js/theme.js?v=20261108-device-default"></script><link rel="stylesheet" href="${up}assets/css/styles.css"><link rel="stylesheet" href="${up}assets/css/logo.css"><link rel="stylesheet" href="${up}assets/css/responsive.css"><link rel="stylesheet" href="${up}assets/css/credits.css"><link rel="stylesheet" href="${up}assets/css/learning.css"><link rel="stylesheet" href="${up}assets/css/theme.css"><link rel="stylesheet" href="${up}assets/css/cableado.css"></head>`}
function footer(){return `<footer class="container"><p>DGNV Studios <small>— aprende construyendo.</small></p><p class="site-credit">Creado por <strong>Caroline y Julio</strong> · 1.º año Redes y Telecomunicaciones · 2026</p><p>© <span id="year"></span></p></footer>`}
function href(i,j,from){return i===from?names[i][j]:`../${folders[i]}/${names[i][j]}`}
for(let i=0;i<categories.length;i++){
 const folder=path.join(out,folders[i]);fs.mkdirSync(folder,{recursive:true});
 for(let j=0;j<categories[i].modules.length;j++){
  const m=categories[i].modules[j], up='../../../';
  const nav=categories.map((c,k)=>`<a class="sidebar-category ${k===i?'active':''}" href="${href(k,0,i)}"><span>${String(k+1).padStart(2,'0')}</span><b>${esc(c.title)}</b><i aria-hidden="true">↗</i></a>`).join('');
  const lessons=categories[i].modules.map((v,k)=>`<a class="${k===j?'active':''}" href="${names[i][k]}"><span>${String(k+1).padStart(2,'0')}</span>${esc(v.title)}</a>`).join('');
  const prev=j?href(i,j-1,i):i?href(i-1,categories[i-1].modules.length-1,i):null,next=j<categories[i].modules.length-1?href(i,j+1,i):i<categories.length-1?href(i+1,0,i):null;
  let model=m.model?modelHtml(m.model):'';if(m.model==='pins')model=model.replace('<div id="cab-pin-art"></div>',`<div id="cab-pin-art">${pins('A')}</div>`);if(m.model==='tester')model=model.replace('<div id="cab-tester-art"></div>',`<div id="cab-tester-art">${fault('Correcto')}</div>`);
  const sections=m.sections.map(([heading,...ps])=>`<section class="cab-section"><h2>${esc(heading)}</h2>${ps.map(p=>`<p>${esc(p)}</p>`).join('')}</section>`).join('');
  const modelPanel=m.model?`<div class="cab-model"><div class="cab-model-header"><span>MODELO DIDÁCTICO</span><small>Representación sin escala</small></div>${model}</div>`:'';
  const lessonBody=m.model==='categories'?sections.replace('</section>','</section>'+modelPanel):modelPanel+sections;
  const html=`${head(m.title,3)}<body><header class="site-header container"><a class="brand" href="${up}index.html" aria-label="Inicio DGNV Studios"><img class="brand-logo" src="${up}assets/images/dgnv-logo.png" alt=""><span>DGNV Studios</span></a></header><main class="container learning-shell"><button class="sidebar-toggle" type="button" data-sidebar-toggle aria-expanded="false">☰ Módulos de cableado estructurado</button><aside class="guide-sidebar" data-guide-sidebar><a class="sidebar-brand" href="../index.html"><small>Cableado estructurado · ${String(i+1).padStart(2,'0')}</small><strong>${esc(categories[i].title)}</strong></a><nav class="sidebar-categories" aria-label="Categorías de cableado estructurado">${nav}</nav><nav class="lesson-nav" aria-label="Módulos de la categoría">${lessons}</nav><a class="sidebar-back" href="../index.html">← Ver categorías</a></aside><article class="lesson-content cab-lesson"><p class="eyebrow"><span></span> Módulo ${String(j+1).padStart(2,'0')}</p><h1>${esc(m.title)}<em>.</em></h1><p class="lesson-lead">${esc(m.lead || m.sections[0][1])}</p>${lessonBody}<div class="lesson-actions">${prev?`<a href="${prev}">← Módulo anterior</a>`:'<span></span>'}${next?`<a href="${next}">Módulo siguiente →</a>`:'<span>Fin del recorrido</span>'}</div>${footer()}</article></main></body></html>`;
  // Move shared scripts after main while retaining the same layout as the other guides.
  const testerScript=m.model==='tester'? `<script src="${up}assets/js/cableado-tester.js"></script>`:'';
  fs.writeFileSync(path.join(folder,names[i][j]),html.replace('</article></main></body></html>',`</article></main><script src="${up}assets/js/main.js"></script><script src="${up}assets/js/cableado.js"></script><script src="${up}assets/js/cableado-nav.js"></script>${testerScript}</body></html>`));
 }
}
const hub=`${head('Cableado estructurado',2)}<body><header class="site-header container"><a class="brand" href="../../index.html" aria-label="Inicio DGNV Studios"><img class="brand-logo" src="../../assets/images/dgnv-logo.png" alt=""><span>DGNV Studios</span></a></header><main class="packet-hub container"><section class="packet-hub-intro"><p class="eyebrow"><span></span>Colección 09 · Infraestructura</p><h1>Cableado <em>estructurado.</em></h1><p class="hero-copy">Pares trenzados, componentes, recorridos y comprobación. Un recorrido desde la construcción del cable hasta la entrega de un enlace documentado.</p></section><section class="modality-overview"><span>Recorrido del episodio 01</span><h2>Qué aprenderás</h2><div class="outcome-grid"><article><strong>Reconocer el cable</strong><p>Comparar pares, blindajes, categorías y cubiertas.</p></article><article><strong>Identificar componentes</strong><p>Ubicar keystone, faceplate, patch panel, rack y cordones.</p></article><article><strong>Planificar recorridos</strong><p>Distinguir cableado horizontal, backbone y espacios.</p></article><article><strong>Comprobar el enlace</strong><p>Leer mapas de hilos, fallas e informes de certificación.</p></article></div></section><section class="category-panel episode-panel"><p class="category-panel-title">Episodios de la modalidad</p><div class="episode-group"><div class="episode-heading"><span>Episodio 01</span><strong>Del cable al enlace comprobado</strong><p>Seis categorías y diecinueve módulos, con modelos didácticos y referencias TIA e IEEE.</p></div><p class="episode-category-label">Categorías del episodio</p><div class="category-grid">${categories.map((c,i)=>`<a class="category-button" href="${folders[i]}/index.html"><span class="category-number">${String(i+1).padStart(2,'0')}</span><span class="category-name">${esc(c.title)}</span><span class="category-arrow">↗</span></a>`).join('')}</div></div></section></main>${footer()}<script src="../../assets/js/main.js"></script></body></html>`;
const categoryPanel=`<section class="category-panel" aria-labelledby="cableado-categorias"><p class="category-panel-title" id="cableado-categorias">Categorías de la guía</p><div class="category-grid">${categories.map((c,i)=>`<a class="category-button" href="${folders[i]}/index.html"><span class="category-number">${String(i+1).padStart(2,'0')}</span><span class="category-name">${esc(c.title)}</span><span class="category-arrow" aria-hidden="true">↗</span></a>`).join('')}</div></section>`;
fs.writeFileSync(path.join(out,'index.html'),hub.replace(/<section class="category-panel episode-panel">.*?<\/section>/,categoryPanel));
console.log('Generadas 19 páginas de módulos.');






