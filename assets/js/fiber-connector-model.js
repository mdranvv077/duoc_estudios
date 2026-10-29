// All surfaces share an orthographic isometric projection: equal scale on X/Y/Z.
let modelId = 0;
export function connectorDrawing(type) {
  const id = `connector-${++modelId}`;
  const project = ([x, y, z]) => [175 + .8660254 * (x - y), 95 + .5 * (x + y) - z];
  const points = vertices => vertices.map(v => project(v).map(n => n.toFixed(2)).join(',')).join(' ');
  const face = (vertices, fill, stroke = '#ffffff28') => `<polygon points="${points(vertices)}" fill="${fill}" stroke="${stroke}" stroke-width=".8" stroke-linejoin="round"/>`;
  const line = (vertices, color, width = 1) => `<polyline points="${points(vertices)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const part = (key, content) => `<g class="fc-part" data-model-part="${key}">${content}</g>`;
  const green = ['#58ba75', '#207b47', '#164e33'];
  const blue = ['#60a9d2', '#246e9f', '#154766'];
  const dark = ['#4a565f', '#28343c', '#18232c'];
  const silver = ['#d8e2e6', '#8b9ca5', '#596c78'];
  const colors = type === 'sc' ? green : type === 'mpo' ? dark : blue;
  const box = (x, length, width, height, palette = colors, z = 0, y = 0) => {
    const a = y - width / 2, b = y + width / 2, c = z - height / 2, d = z + height / 2, end = x + length;
    return face([[x,a,d],[end,a,d],[end,b,d],[x,b,d]], palette[0]) +
      face([[x,b,c],[end,b,c],[end,b,d],[x,b,d]], palette[1]) +
      face([[end,a,c],[end,b,c],[end,b,d],[end,a,d]], palette[2]);
  };
  // Circular cross-sections projected from actual 3D rings, including tapered boots.
  const ring = (x, radius, tilt = 0) => Array.from({length: 48}, (_, i) => {
    const angle = i * Math.PI / 24, y = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
    return [x + z * tilt, y, z];
  });
  const cylinder = (x, length, radius, material = 'metal', endRadius = radius, tilt = 0) => {
    const back = ring(x, radius), front = ring(x + length, endRadius, tilt);
    const palettes = {
      metal: ['#a2b1b9', '#dce6e9', '#3e525e'],
      rubber: ['#29343b', '#52616a', '#111b23'],
      ceramic: ['#cbd5cf', '#f4f5e9', '#8c9e96'],
      cable: ['#c5a52d', '#f4d664', '#79601b'],
      azure: ['#23a9dc', '#90e6ff', '#086b9c'],
    };
    const p = palettes[material];
    // Only the near semicircle is visible: y + z > 0 for this camera direction.
    const start = 42, end = 66;
    const arc = r => Array.from({length: end - start + 1}, (_, i) => r[(start + i) % 48]);
    return face([...arc(back), ...arc(front).reverse()], `url(#${id}-${material})`, p[2]) +
      face(front, p[0], p[2]) + line(arc(front), p[1], 1.1);
  };
  const seam = (x, radius, color = '#17252dbb') => line(ring(x, radius).slice(42).concat(ring(x, radius).slice(0, 19)), color, 1.2);
  const boot = (end, radius) => {
    let result = cylinder(-85, 140, 6.5, 'cable');
    let rubber = cylinder(55, 22, 9, 'rubber') + cylinder(77, end - 77, 10, 'rubber', radius);
    for (let i = 0; i < 9; i++) {
      const x = 84 + i * (end - 92) / 9, r = 10 + (radius - 10) * (x - 77) / (end - 77);
      rubber += cylinder(x, 4, r + 1.5, 'rubber') + seam(x + 4, r + 1.5, '#76838b66');
    }
    return result + part('boot', rubber);
  };
  const ceramic = (x, length, radius, apc = false) => {
    const tilt = apc ? Math.tan(8 * Math.PI / 180) : 0;
    return part('ferrule', cylinder(x, length, radius, 'ceramic', radius, tilt) +
      face(ring(x + length + .1, .8, tilt), '#566e77', '#647c85'));
  };
  let shape = '';
  if (type === 'sc' || type === 'lc') {
    const lc = type === 'lc', w = lc ? 35 : 58, h = lc ? 34 : 54;
    shape += boot(195, lc ? 15 : 21);
    let body = box(190, 27, w - 9, h - 9) + box(212, 137, w, h) + box(349, 37, w - 10, h - 10);
    // Mold seam and recessed side panels follow the connector's surfaces.
    body += face([[253,w/2+.2,-h/2+7],[331,w/2+.2,-h/2+7],[331,w/2+.2,h/2-7],[253,w/2+.2,h/2-7]], lc ? '#1c5782' : '#195f39', '#a0e5bc44');
    body += line([[221,-w/2+4,h/2+.2],[342,-w/2+4,h/2+.2]], '#d1f7de77');
    body += line([[349,-w/2,h/2],[349,w/2,h/2],[349,w/2,-h/2]], '#091e27bb');
    shape += part('body', body);
    let lock = '';
    if (lc) {
      // Spring latch attached at the front, with a raised release tab at the rear.
      lock += box(231, 27, 20, 6, blue, 38);
      lock += face([[253,-8,35],[335,-8,21],[335,8,21],[253,8,35]], '#7ab9d9');
      lock += face([[253,8,35],[335,8,21],[335,8,17],[253,8,31]], '#265d7f');
      lock += box(331, 9, 18, 8, blue, 22);
      for (let x=235;x<254;x+=5) lock += line([[x,-9,41.2],[x,9,41.2]], '#26526c', 1.3);
    } else {
      lock += box(272, 43, 14, 5, green, h/2+2.5, -10);
      for (let x=223;x<=243;x+=5) {
        lock += line([[x,-w/2+2,h/2+.4],[x,w/2,h/2+.4],[x,w/2+.4,-h/2+3]], '#103d2f', 2);
        lock += line([[x+1.5,-w/2+2,h/2+.5],[x+1.5,w/2,h/2+.5]], '#8ad39a77');
      }
    }
    shape += part('lock', lock);
    shape += part('body', cylinder(386, 9, lc ? 9 : 14, 'metal'));
    shape += ceramic(395, lc ? 37 : 49, lc ? 5.5 : 9, !lc);
  } else if (type === 'st') {
    shape += cylinder(-85, 140, 6.5, 'cable');
    let relief = cylinder(55, 145, 9, 'azure', 19) + cylinder(200, 53, 19, 'azure');
    // Shallow flexible slots across the tapered blue boot, with solid bridges.
    for (let i=0;i<7;i++) {
      const x=70+i*17, r=9+(x-55)*10/145;
      relief += line([[x,r*.95,r*.3],[x,r*.7,r*.73],[x,r*.25,r*.97]], '#08618d', 4);
      relief += line([[x,r*.95,-r*.28],[x,r*.98,-r*.1]], '#08618d', 3);
    }
    shape += part('boot', relief);
    shape += part('body', cylinder(248, 13, 21));
    let collar = cylinder(261, 43, 30);
    // Longitudinal grip ridges, unlike the screw thread on an FC collar.
    for (let i=0;i<15;i++) {
      const a=-Math.PI/4+i*Math.PI/14, y=30.3*Math.cos(a), z=30.3*Math.sin(a);
      collar += line([[263,y,z],[301,y,z]], '#41545e', 1.6);
      collar += line([[263,y-.5,z+.5],[301,y-.5,z+.5]], '#f1f5f4aa', .7);
    }
    collar += cylinder(304, 53, 27);
    // Open-ended J-shaped bayonet slots in the smooth forward sleeve.
    collar += line([[356,15,22],[330,15,22],[326,23,14],[331,26,7]], '#101a21', 7);
    collar += line([[355,26,-7],[337,26,-7],[331,20,-18]], '#101a21', 5);
    collar += cylinder(357, 5, 29);
    // Recessed annular front around the ceramic ferrule carrier.
    collar += face(ring(362.2,24), '#26343c', '#e2e8e7');
    collar += cylinder(362.4, 5, 16);
    collar += cylinder(367.4, 4, 12);
    shape += part('lock', collar);
    shape += ceramic(371.4, 62, 9);
  } else if (type === 'fc') {
    const fc = type === 'fc';
    shape += boot(208, 18);
    shape += part('body', cylinder(202, 55, 22) + seam(218,22) + seam(232,22));
    let collar = cylinder(250, fc ? 99 : 90, 32);
    for (let x=255;x<335;x+=6) collar += seam(x,32.4,'#30455088');
    if (fc) {
      // Fine cross-hatching on the rotating grip; the alignment key is separate.
      for (let i=0;i<12;i++) {
        const a = (i/12)*Math.PI*1.15 - .7;
        collar += line([[253,32.5*Math.cos(a),32.5*Math.sin(a)],[342,32.5*Math.cos(a+.18),32.5*Math.sin(a+.18)]], '#e4eef044', .8);
      }
      collar += cylinder(349, 28, 19);
      for(let x=351;x<377;x+=4) collar += seam(x,19.3);
      collar += box(367, 13, 7, 5, silver, 20);
    } else {
      // Bayonet slots on the collar: an axial entrance followed by a short turn.
      collar += line([[340,22,22],[320,22,22],[320,30,8]], '#172b37', 4);
      collar += line([[340,28,-15],[320,28,-15],[320,19,-26]], '#172b37', 4);
      collar += cylinder(340, 30, 17);
      collar += box(356, 8, 7, 5, silver, 18);
    }
    shape += part('lock', collar);
    shape += ceramic(fc ? 377 : 370, fc ? 56 : 65, 9);
  } else {
    shape += boot(203, 20);
    const aqua = ['#72e0df', '#219fab', '#13727d'];
    const insert = ['#404b50', '#202a30', '#121c22'];
    shape += part('body', box(199, 25, 56, 33, dark) + box(224, 133, 78, 48, aqua));
    let lock = box(275, 33, 18, 5, aqua, 26.5, -16);
    for(let x=234;x<259;x+=5) lock += line([[x,-37,24.2],[x,39,24.2],[x,39.2,-21]], '#146d78', 2);
    lock += line([[229,-36,24.5],[351,-36,24.5]], '#b6ffff99', 1.4);
    shape += part('lock', lock);
    shape += part('body', box(357, 13, 68, 39, insert) + box(370, 12, 60, 30, insert) + box(357, 20, 16, 7, insert, 20));
    let ferrule = box(382, 15, 52, 22, ['#4c5558','#293237','#182127']);
    // The fiber row belongs on the end face, not along the housing side.
    for(let i=0;i<12;i++) {
      const center = -16.5+i*3;
      const circle = ring(397.2, .6).map(([x,y,z])=>[x,y+center,z]);
      ferrule += face(circle,'#f5efd3','#c8d2c8');
    }
    for(const y of [-23,23]) {
      ferrule += face(ring(397.3,2).map(([x,a,z])=>[x,a+y,z]),'#b8c7cb','#e0eaed');
      ferrule += `<g transform="translate(${-0.8660254*y} ${.5*y})">${cylinder(397.5, 12, 1.35, 'metal')}</g>`;
    }
    shape += part('ferrule', ferrule);
  }
  const labels = {sc:'SC/APC · carcasa verde',lc:'LC · pestaña de retención',st:'ST · cierre de bayoneta',fc:'FC · collar roscado',mpo:'MPO · interfaz multifibra'};
  const gradients = Object.entries({azure:['#89e4ff','#179dce','#0874ab'],metal:['#e4eced','#8298a2','#344954'],rubber:['#68747a','#29363f','#101820'],ceramic:['#fffff4','#d3ded7','#84958f'],cable:['#ffdf73','#c6a530','#7f641c']}).map(([name, c])=>`<linearGradient id="${id}-${name}" x1="0" y1="0" x2=".4" y2="1"><stop stop-color="${c[0]}"/><stop offset=".35" stop-color="${c[1]}"/><stop offset=".65" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient>`).join('');
  return `<svg viewBox="0 0 760 420" role="img" aria-label="${labels[type]}, perspectiva isométrica"><defs>${gradients}</defs><text x="35" y="38" class="fc-svg-title">${labels[type]}</text><g transform="translate(70 4)">${shape}</g><text x="35" y="390">VISTA ISOMÉTRICA · MODELO DIDÁCTICO · SIN ESCALA COMÚN</text></svg>`;
}
