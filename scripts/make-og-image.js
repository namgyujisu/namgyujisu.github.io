/* 카카오톡·메신저 링크 미리보기용 이미지 생성기
   실행: node scripts/make-og-image.js

   미리보기 카드는 가로형(1.91:1)이라, 세로 사진을 그대로 쓰면
   양옆에 흰 여백이 생긴다. 그래서 1200x630 으로 따로 만든다.

   실제 웨딩 사진이 준비되면 이 스크립트 대신
   사진을 1200x630 으로 잘라 images/og-image.jpg 에 덮어쓰면 된다. */
const sharp = require('sharp');
const path = require('path');

const W = 1200, H = 630;

// 이 환경에 한글 폰트가 없어 이미지 안 문구는 영문으로 둔다.
// (카톡 카드의 제목·설명은 og:title / og:description 에서 한글로 나온다)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="#e3dacd"/>
      <stop offset="55%" stop-color="#c9bba6"/>
      <stop offset="100%" stop-color="#a89781"/>
    </linearGradient>
    <radialGradient id="v" cx="50%" cy="45%" r="75%">
      <stop offset="50%"  stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity=".22"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#v)"/>
  <rect x="46" y="46" width="${W - 92}" height="${H - 92}"
        fill="none" stroke="#fff" stroke-opacity=".42"/>

  <text x="${W / 2}" y="252" text-anchor="middle" font-family="DejaVu Serif"
        font-size="30" letter-spacing="11" fill="#fff" fill-opacity=".78">WE ARE GETTING MARRIED</text>

  <text x="${W / 2}" y="352" text-anchor="middle" font-family="DejaVu Serif"
        font-size="66" letter-spacing="7" fill="#fff">NAMGYU &amp; JISU</text>

  <line x1="${W / 2 - 34}" y1="398" x2="${W / 2 + 34}" y2="398"
        stroke="#fff" stroke-opacity=".8"/>

  <text x="${W / 2}" y="452" text-anchor="middle" font-family="DejaVu Serif"
        font-size="34" letter-spacing="9" fill="#fff" fill-opacity=".95">2027. 10. 17. SUN</text>

  <text x="${W / 2}" y="500" text-anchor="middle" font-family="DejaVu Serif"
        font-size="23" letter-spacing="5" fill="#fff" fill-opacity=".8">NOBLE VALENTI SAMSUNG</text>
</svg>`;

sharp(Buffer.from(svg))
  .jpeg({ quality: 90 })
  .toFile(path.join(__dirname, '..', 'images', 'og-image.jpg'))
  .then((i) => console.log(`og-image.jpg  ${i.width}x${i.height}  ${(i.size / 1024).toFixed(0)}KB`))
  .catch((e) => { console.error(e); process.exit(1); });
