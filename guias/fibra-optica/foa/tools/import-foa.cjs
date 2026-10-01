/* Rebuild the static reader from the ten supplied Word-exported HTML chapters.
   Usage: node import-foa.cjs <source-directory>
   Requires Playwright (or NODE_PATH pointing to the bundled runtime).
   The source directory is read-only; generated files stay in foa/. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');
const chapters = require('./chapters.json');
const output = path.resolve(__dirname, '..');
const source = process.argv[2] && path.resolve(process.argv[2]);
if (!source) throw new Error('Provide the directory containing the ten source HTML files.');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const normalize = text => text.replace(/\s+/g, ' ').trim();
const slug = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const removals = [];
const assets = new Map();

function cleanText(text, chapter) {
  let result = text.replace(/Objectivos/g, 'Objetivos');
  if (/^(?:Tabla de contenido\.?|[Ó©].*\b20\d\d.*Association)/i.test(result)) return '';
  if (/^(?:Revise los vídeos de FOA|Lea (?:las|la) (?:páginas?|secciones).*FOA|Puedes ver más.*FOA|Aprenda .*Guía de referencia|El libro de texto de la FOA|La FOA desea agradecer|La Guía de referencia en línea de la FOA contiene|En la Guía de consulta en línea|Recuerde que las escuelas aprobadas|Encontrará más información.*FOA|En el sitio web de la Asociación)/i.test(result)) return '';
  const edits = [
    ['La FOA está interesada principalmente en la fibra óptica para comunicaciones, por lo que este libro se centrará en esa aplicación.', 'Este capítulo se centra en la fibra óptica para comunicaciones.'],
    ['También puede utilizar la Guía de referencia en línea de la FOA para obtener explicaciones más detalladas.', ''],
    ['FOA Tech Topics incluye un resumen de las especificaciones de muchos de estos sistemas.', ''],
    ['En el sitio web de la FOA figura una lista de las normas TIA e ISO sobre fibra óptica.', ''],
    ['y se tratan con más detalle en el libro de texto de la FOA sobre pruebas.', '.'],
    ['como haber realizado un curso de certificación CFOT de la FOA,', 'como haber realizado formación técnica en fibra óptica,'],
    ['por organizaciones como la Asociación Profesional de Fibra Óptica FOA (www.thefoa.org) y/o los fabricantes de los productos que se instalen.', 'por organizaciones de formación técnica y/o los fabricantes de los productos que se instalen.'],
    ['En la FOA tenemos muchos ejemplos de instalaciones que salieron mal con terribles consecuencias.', ''],
    ['en sitios web como la Guía de referencia en línea de la FOA', 'en materiales de formación técnica'],
    ['En los sitios web de la FOA y de muchos fabricantes, hay tutoriales', 'Existen tutoriales'],
    ['los tutoriales "prácticos virtuales" (VHO por siglas en inglés [Virtual hands-on]) de la FOA', 'tutoriales prácticos virtuales'],
    ['Muchas escuelas homologadas por la FOA ofrecen', 'Muchas escuelas de formación técnica ofrecen'],
    [', por ejemplo en la Guía de referencia de fibra óptica en línea de la FOA', ''],
    [', como las escuelas autorizadas por la FOA,', ''],
    [', que puede descargarse gratuitamente de FOA,', ','],
    ['en los sitios web de los fabricantes.', 'de los fabricantes.'],
    ['Todas las páginas de "Pruebas y resolución de problemas de los sistemas de fibra óptica"', 'Pruebas y resolución de problemas de los sistemas de fibra óptica'],
  ];
  for (const [from, to] of edits) result = result.replaceAll(from, to);
  result = normalize(result.replace(/https?:\/\/\S+|www\.[\w./-]+/g, '').replace(/\s+\./g, '.'));
  if (result !== text) removals.push({ chapter, original: text, replacement: result });
  return result;
}

function shell(title, description, content) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escape(description)}" />
    <title>${escape(title)} — FOA · Fibra óptica</title>
    <link rel="icon" type="image/png" href="../../../img/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../../../assets/css/styles.css" />
    <link rel="stylesheet" href="../../../assets/css/logo.css" />
    <link rel="stylesheet" href="../../../assets/css/responsive.css?v=20260930-fiber" />
    <link rel="stylesheet" href="../../../assets/css/credits.css" />
    <link rel="stylesheet" href="../../../assets/css/learning.css?v=20260930-foa" />
    <link rel="stylesheet" href="../../../assets/css/math.css?v=20260930-fiber" />
    <link rel="stylesheet" href="../../../assets/css/fiber.css?v=20260930-vfl-connect-flow" />
    <link rel="stylesheet" href="assets/foa.css?v=20260930-book" />
  </head>
  <body>
    <header class="site-header container"><a class="brand" href="../../../index.html" aria-label="Inicio DGNV Studios"><img class="brand-logo" src="../../../assets/images/dgnv-logo.png" alt="" /><span>DGNV Studios</span></a></header>
    <main class="container learning-shell">
      <button class="sidebar-toggle" type="button" data-sidebar-toggle aria-expanded="false">☰ Capítulos del libro FOA</button>
      <aside class="guide-sidebar" data-guide-sidebar>
        <a class="sidebar-brand" href="index.html"><small>Fibra óptica · Biblioteca</small><strong>FOA · Libro de consulta</strong></a>
        <nav class="sidebar-categories" aria-label="Categorías de fibra óptica"></nav>
        <nav class="lesson-nav" aria-label="Capítulos del libro FOA"></nav>
        <a class="sidebar-back" href="../index.html">← Ver modalidad</a>
      </aside>
      <article class="lesson-content foa-reader" data-foa-reader>
${content}
        <footer class="foa-footer"><a href="index.html">FOA · Índice del libro</a><a href="../index.html">Fibra óptica</a><span>DGNV Studios · <span id="year">2026</span></span></footer>
      </article>
    </main>
    <script src="../../../assets/js/main.js"></script>
    <script src="../../../assets/js/fiber-guide.js?v=20260930-foa"></script>
  </body>
</html>
`;
}

async function extract(page, chapter) {
  const html = fs.readFileSync(path.join(source, chapter.source), 'utf8');
  return page.evaluate(html => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const norm = text => text.replace(/\s+/g, ' ').trim();
    const esc = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
    function inline(node) {
      if (node.nodeType === 3) return esc(node.textContent.replace(/\s+/g, ' '));
      if (node.nodeType !== 1 || /^(SCRIPT|STYLE|IMG|IFRAME|OBJECT)$/.test(node.tagName)) return '';
      if (node.tagName === 'BR') return '<br />';
      if (node.tagName === 'U' && !norm(node.textContent)) return ' ______ ';
      const contents = [...node.childNodes].map(inline).join('');
      const tag = ({B:'strong',STRONG:'strong',I:'em',EM:'em',SUP:'sup',SUB:'sub'})[node.tagName];
      return tag && norm(node.textContent) ? '<'+tag+'>'+contents+'</'+tag+'>' : contents;
    }
    const root = doc.querySelector('.WordSection1') || doc.body;
    const selector = 'p,h1,h2,h3,h4,table,ul,ol';
    const blocks = [...root.querySelectorAll(selector)].filter(el => !el.parentElement.closest(selector)).map(el => {
      const images = [...el.querySelectorAll('img')].map(img => ({src:img.getAttribute('src'),width:Number(img.getAttribute('width')),height:Number(img.getAttribute('height')),alt:img.getAttribute('alt')||''}));
      const text = norm(el.textContent);
      const result = {tag:el.tagName,text,html:inline(el).trim(),images,anchors:[...el.querySelectorAll('a[name], [id]')].filter(x=>x.tagName!=='IMG').map(x=>x.getAttribute('name')||x.id)};
      if(el.tagName==='TABLE') result.rows = [...el.rows].map(tr=>[...tr.cells].map(td=>({html:[...td.children].map(inline).join('<br />')||inline(td),text:norm(td.textContent),cols:td.colSpan,rows:td.rowSpan}))).filter(row=>row.some(cell=>cell.text));
      return result;
    }).filter(b=>b.text||b.images.length);
    return {blocks,sourceImages:doc.querySelectorAll('img').length};
  }, html);
}

function buildChapter(chapter, data, index) {
  let figureIndex=0, seenTitle=false, inReview=false, heading=chapter.title;
  const usedIds = new Set(), headings=[], body=[], objectives=[];
  let collectingObjectives=false;
  const report={source:chapter.source,page:chapter.slug+'.html',sourceBlocks:data.blocks.length,sourceImages:data.sourceImages,figures:0,tables:0,removed:[],subsections:0};
  function headingId(text) {const base=slug(text)||'apartado';let id=base,n=2;while(usedIds.has(id))id=base+'-'+n++;usedIds.add(id);return id;}
  function addImages(images) {
    for(const image of images){
      if(/image001\.jpg$/i.test(image.src)){report.removed.push('Repeated header logo: '+image.src);continue;}
      const original=path.resolve(source,image.src);
      if(!original.startsWith(source+path.sep))throw new Error('Image outside source directory: '+image.src);
      const bytes=fs.readFileSync(original),hash=crypto.createHash('sha256').update(bytes).digest('hex');
      const caption=chapter.figures[figureIndex]||heading;
      figureIndex++;
      let asset=assets.get(hash);
      if(!asset){asset='img/'+chapter.slug+'-'+String(figureIndex).padStart(2,'0')+path.extname(original).toLowerCase();fs.copyFileSync(original,path.join(output,asset));assets.set(hash,asset);}
      const wide=image.width/image.height>4;
      body.push({kind:'figure',html:`<figure class="foa-figure${wide?' foa-figure-wide':''}"><a class="foa-figure-link" href="${asset}" data-foa-image target="_blank" rel="noopener" aria-label="Ampliar: ${escape(caption)}"><img src="${asset}" alt="${escape(caption)}" width="${image.width||600}" height="${image.height||400}" loading="lazy" decoding="async" /></a><figcaption><span>Figura ${index+1}.${figureIndex} · ${escape(caption)}</span><a href="${asset}" data-foa-image target="_blank" rel="noopener">Ampliar figura <span aria-hidden="true">↗</span></a></figcaption></figure>`});
      report.figures++;
    }
  }
  function addHeading(text,level){
    const id=headingId(text);heading=text;
    body.push({kind:'heading',level,id,text,html:`<h${level} id="${id}">${escape(text)}</h${level}>`});
    if(level===2)headings.push({id,text});
  }
  for(const block of data.blocks){
    const original=block.text;
    const text=cleanText(original,chapter.source);
    if(original&&!text){report.removed.push(original);continue;}
    if(/^H[1-4]$/.test(block.tag)&&text){
      if(!seenTitle){seenTitle=true;addImages(block.images);continue;}
      collectingObjectives=false;
      inReview=/Preguntas de Repaso/i.test(text)?true:/Estudios?|Proyectos/i.test(text)?false:inReview;
      addHeading(text,2);addImages(block.images);continue;
    }
    if(/^Objetivos:/i.test(text)){collectingObjectives=true;continue;}
    if(collectingObjectives&&text){objectives.push(text);addImages(block.images);continue;}
    if(block.tag==='TABLE' && text){
      const rows=block.rows.map((row,n)=>'<tr>'+row.map(cell=>{const tag=n===0?'th':'td';return '<'+tag+(n===0?' scope="col"':'')+(cell.cols>1?' colspan="'+cell.cols+'"':'')+(cell.rows>1?' rowspan="'+cell.rows+'"':'')+'>'+cell.html.replace(/(?:<br \/>\s*){2,}/g,'<br />')+'</'+tag+'>';}).join('')+'</tr>');
      body.push({kind:'table',html:`<div class="foa-table-wrap" tabindex="0" role="region" aria-label="Tabla: ${escape(heading)}"><table><caption>${escape(heading)}</caption><thead>${rows[0]}</thead><tbody>${rows.slice(1).join('\n')}</tbody></table></div>`});report.tables++;addImages(block.images);continue;
    }
    if(text){
      let content=text===original?block.html:escape(text);
      content=content.replace(/(?:<br \/>\s*){2,}/g,'<br />').replace(/^(?:\s|<br \/>)+|(?:\s|<br \/>)+$/g,'');
      const words=text.match(/[A-Za-zÁÉÍÓÚÑÜáéíóúñü][\wÁÉÍÓÚÑÜáéíóúñü-]*/g)||[];
      const capitalRatio=words.filter(w=>/^[A-ZÁÉÍÓÚÑÜ]/.test(w)).length/Math.max(words.length,1);
      const isTitle=!inReview && text.length<155 && !/[.!?;]$/.test(text) && !/^[-•\d_]|^[A-D]\./.test(text) && capitalRatio>=.55 && !/^\(/.test(text);
      if(isTitle){addHeading(text.replace(/:$/,''),3);}
      else if(/^[•●]\s*/.test(text)){body.push({kind:'bullet',html:content.replace(/^[•●]\s*/,''),text});}
      else if(inReview&&/^(?:_+\s*)?\d+\./.test(text)){body.push({kind:'question',html:content,text});}
      else if(inReview&&/^[A-F]\.\s/.test(text)){body.push({kind:'answer',html:content.replace(/^[A-F]\.\s*/,''),text});}
      else body.push({kind:'paragraph',html:`<p>${content}</p>`,text});
    }
    addImages(block.images);
  }
  // Remove section titles whose sole content was a deleted site recommendation.
  for(let n=body.length-1;n>=0;n--){if(body[n].kind==='heading'&&(!body[n+1]||(body[n+1].kind==='heading'&&body[n+1].level<=body[n].level)))body.splice(n,1);}
  const html=[];
  for(let n=0;n<body.length;n++){
    const b=body[n];
    if(b.kind==='bullet'||b.kind==='answer'){
      const group=[b];while(body[n+1]?.kind===b.kind)group.push(body[++n]);
      const tag=b.kind==='answer'?'ol':'ul';html.push(`<${tag}${b.kind==='answer'?' class="foa-answers" type="A"':''}>\n${group.map(x=>'<li>'+x.html+'</li>').join('\n')}\n</${tag}>`);
    } else if(b.kind==='question')html.push(`<p class="foa-question">${b.html}</p>`);
    else html.push(b.html);
  }
  const actualHeadings=body.filter(b=>b.kind==='heading'&&b.level===2);
  const wordCount=body.map(b=>b.text||'').join(' ').split(/\s+/).length;
  report.words=wordCount;report.subsections=body.filter(b=>b.kind==='heading').length;
  const previous=chapters[index-1],next=chapters[index+1];
  const content=`        <a class="foa-breadcrumb" data-foa-page href="index.html">← Índice del libro</a>
        <p class="eyebrow"><span></span> Libro FOA · Capítulo ${String(index+1).padStart(2,'0')}</p>
        <h1>${escape(chapter.title)}</h1>
        <p class="lesson-lead">${escape(chapter.description)}</p>
        <div class="foa-meta"><span>${actualHeadings.length} apartados</span><span>Lectura de consulta</span><span>${report.figures} figuras</span></div>
        <details class="foa-toc"><summary>En este capítulo</summary><nav aria-label="Apartados del capítulo">${actualHeadings.map(h=>`<a href="#${h.id}" data-foa-anchor>${escape(h.text)}</a>`).join('\n')}</nav></details>
        ${objectives.length?`<section class="foa-objectives" aria-label="Objetivos"><h2>Qué aprenderás</h2><ul>${objectives.map(t=>'<li>'+escape(t)+'</li>').join('')}</ul></section>`:''}
        <div class="foa-prose">\n${html.join('\n\n')}\n        </div>
        <div class="lesson-actions"><a data-foa-page href="${previous?previous.slug+'.html':'index.html'}">← ${previous?escape(previous.short):'Índice del libro'}</a><a data-foa-page href="${next?next.slug+'.html':'index.html'}">${next?escape(next.short):'Volver al índice'} →</a></div>`;
  fs.writeFileSync(path.join(output,chapter.slug+'.html'),shell(chapter.title,chapter.description,content));
  return {...report,headings:actualHeadings.map(h=>h.text)};
}

(async()=>{
  fs.mkdirSync(path.join(output,'img'),{recursive:true});
  const browser=await chromium.launch({channel:process.env.FOA_BROWSER_CHANNEL||'msedge',headless:true});
  const reports=[];
  try {const page=await browser.newPage();for(let i=0;i<chapters.length;i++) reports.push(buildChapter(chapters[i],await extract(page,chapters[i]),i));}
  finally {await browser.close();}
  const totalFigures=reports.reduce((a,c)=>a+c.figures,0);
  const content=`        <p class="eyebrow"><span></span> Biblioteca · Fibra óptica</p>
        <h1>FOA. <em>El libro.</em></h1>
        <p class="lesson-lead">Diez capítulos para consultar la fibra óptica de principio a fin: conceptos, componentes, diseño, instalación y pruebas.</p>
        <div class="foa-book-stats"><span><strong>10</strong> capítulos</span><span><strong>${totalFigures}</strong> figuras</span><span><strong>${reports.reduce((a,c)=>a+c.tables,0)}</strong> tablas</span></div>
        <div class="foa-book-intro"><p>Puedes seguir el orden del libro o entrar directamente al tema que necesitas. Cada capítulo conserva sus explicaciones, ejemplos, preguntas de repaso y actividades. Las figuras se pueden ampliar para leer sus detalles.</p><a class="foa-start" data-foa-page href="introduccion.html">Comenzar la lectura <span aria-hidden="true">→</span></a></div>
        <label class="foa-search-label" for="foa-search">Busca un capítulo o tema</label>
        <input class="foa-search" id="foa-search" type="search" placeholder="Por ejemplo: conectores, OTDR o pérdidas" autocomplete="off" />
        <p class="foa-search-count" data-foa-search-count role="status">10 capítulos disponibles</p>
        <div class="foa-chapter-grid">${chapters.map((c,i)=>`<a class="foa-chapter-card" data-foa-page data-foa-search="${escape(c.title+' '+c.description+' '+reports[i].headings.join(' '))}" href="${c.slug}.html"><span class="foa-chapter-number">${String(i+1).padStart(2,'0')}</span><h2>${escape(c.title)}</h2><p>${escape(c.description)}</p><small>${reports[i].figures} figuras · ${reports[i].headings.length} apartados</small><span class="foa-card-arrow" aria-hidden="true">↗</span></a>`).join('\n')}</div>
        <p class="foa-empty" data-foa-empty hidden>No hay capítulos que coincidan. Prueba con otra palabra.</p>
        <div class="lesson-actions"><a href="../index.html">← Volver a fibra óptica</a><a data-foa-page href="introduccion.html">Primer capítulo →</a></div>`;
  fs.writeFileSync(path.join(output,'index.html'),shell('El libro','Libro FOA: diez capítulos de fibra óptica, con figuras, tablas y preguntas de repaso.',content));
  fs.writeFileSync(path.join(__dirname,'import-report.json'),JSON.stringify({chapters:reports,uniqueImages:assets.size,totalFigures,textEdits:removals},null,2)+'\n');
  console.log(JSON.stringify({chapters:reports.map(({source,figures,tables,subsections,words})=>({source,figures,tables,subsections,words})),uniqueImages:assets.size,totalFigures},null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
