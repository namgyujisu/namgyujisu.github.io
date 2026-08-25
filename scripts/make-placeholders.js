/* 사진을 넣기 전까지 쓸 자리표시(placeholder) SVG 생성기
   실행: node scripts/make-placeholders.js
   실제 사진으로 교체한 뒤에는 실행하지 않아도 됩니다.       */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'images');
fs.mkdirSync(OUT, { recursive: true });

const PALETTES = [
  ['#e8e0d3', '#cdbfa9'], ['#e4ddd6', '#c3b3a4'], ['#e9e3d6', '#c9bda4'],
  ['#e2ddd4', '#bfb4a5'], ['#ece4d8', '#d2c3ac'], ['#e0dad2', '#bdb2a3'],
  ['#eae3d5', '#ccbfa7'], ['#e6dfd5', '#c6b9a8'], ['#ede6da', '#d0c2ab'],
];

function svg(w, h, [c1, c2], label, sub) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="v" cx="50%" cy="42%" r="72%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity=".20"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#v)"/>
  <g fill="none" stroke="#fff" stroke-opacity=".38">
    <rect x="${w * 0.06}" y="${h * 0.05}" width="${w * 0.88}" height="${h * 0.90}"/>
  </g>
  <text x="50%" y="${h / 2 - (sub ? 14 : 0)}" text-anchor="middle"
        font-family="Georgia, serif" font-size="${Math.round(w * 0.045)}"
        letter-spacing="${Math.round(w * 0.012)}" fill="#fff" fill-opacity=".85">${label}</text>
  ${sub ? `<text x="50%" y="${h / 2 + Math.round(w * 0.055)}" text-anchor="middle"
        font-family="sans-serif" font-size="${Math.round(w * 0.024)}"
        letter-spacing="${Math.round(w * 0.006)}" fill="#fff" fill-opacity=".65">${sub}</text>` : ''}
</svg>`;
}

// 히어로 (세로 사진)
fs.writeFileSync(
  path.join(OUT, 'hero.svg'),
  svg(1200, 1800, ['#ded5c8', '#a89781'], 'HERO PHOTO', '대표 사진을 images/hero.jpg 로 교체하세요')
);

// 갤러리 (정사각형)
PALETTES.forEach((p, i) => {
  const n = String(i + 1).padStart(2, '0');
  fs.writeFileSync(path.join(OUT, `gallery-${n}.svg`), svg(900, 900, p, n, ''));
});

console.log(`placeholders written to ${OUT}`);
