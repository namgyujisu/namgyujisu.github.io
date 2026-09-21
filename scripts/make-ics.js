/* 캘린더 등록용 .ics 생성기
   실행: node scripts/make-ics.js   →  invite.ics

   왜 파일로 만들어 두는가
   ─────────────────────
   브라우저에서 즉석으로 만들어(Blob) 내려받게 할 수도 있지만, 하객 대부분은
   카카오톡 안의 내장 브라우저로 청첩장을 연다. 거기서는 Blob 다운로드가
   조용히 막히는 경우가 있어, 실제 파일을 두고 링크로 거는 편이 안전하다.

   CONFIG.date 를 바꾸면 이 스크립트를 다시 돌려야 invite.ics 도 따라 바뀐다. */
const fs = require('fs');
const path = require('path');

// config.js 는 브라우저용이라 module.exports 가 없다. 그대로 읽어서 평가한다.
const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'config.js'), 'utf8');
const CONFIG = new Function('window', `${src}; return CONFIG;`)({});

const D = CONFIG.date;
const V = CONFIG.venue;
const DURATION_HOURS = 2;

// 한국 시간을 UTC 로 바꿔 Z 표기로 적는다. VTIMEZONE 블록을 쓰지 않아도
// 모든 캘린더 앱이 똑같이 해석한다 (KST = UTC+9, 서머타임 없음).
const pad = (n) => String(n).padStart(2, '0');
const utc = (h) => {
  const d = new Date(Date.UTC(D.year, D.month - 1, D.day, h - 9, D.minute));
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
         `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
};

// 쉼표 · 세미콜론 · 줄바꿈은 .ics 문법에서 의미가 있어 이스케이프해야 한다.
const esc = (s) => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');

const lines = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//namgyujisu//wedding invitation//KO',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
  'BEGIN:VEVENT',
  `UID:wedding-${D.year}${pad(D.month)}${pad(D.day)}@namgyujisu.github.io`,
  `DTSTAMP:${utc(D.hour)}`,
  `DTSTART:${utc(D.hour)}`,
  `DTEND:${utc(D.hour + DURATION_HOURS)}`,
  `SUMMARY:${esc(`${CONFIG.groom.name} ♥ ${CONFIG.bride.name} 결혼식`)}`,
  `LOCATION:${esc(`${V.name} ${V.hall} (${V.address})`)}`,
  `DESCRIPTION:${esc(`${V.name} ${V.hall}\n${V.address} ${V.addressDetail}\nTel. ${V.tel}\n\nhttps://namgyujisu.github.io/`)}`,
  'BEGIN:VALARM',            // 하루 전 알림
  'TRIGGER:-P1D',
  'ACTION:DISPLAY',
  'DESCRIPTION:내일은 결혼식입니다',
  'END:VALARM',
  'END:VEVENT',
  'END:VCALENDAR',
];

// .ics 는 줄바꿈이 CRLF 여야 한다. LF 만 쓰면 무시하는 앱이 있다.
const out = path.join(__dirname, '..', 'invite.ics');
fs.writeFileSync(out, lines.join('\r\n') + '\r\n', 'utf8');
console.log(`invite.ics 생성 완료 — ${D.year}.${pad(D.month)}.${pad(D.day)} ${D.hour}:${pad(D.minute)} (${DURATION_HOURS}시간)`);
