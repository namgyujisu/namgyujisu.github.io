/* 참석여부 명단 내려받기 + 집계
   실행: node scripts/pull-rsvp.js [저장할파일.csv]

   보안 규칙에서 rsvp 읽기를 막아두었으므로(하객끼리 못 보게) 웹에서는 명단을
   볼 수 없다. 콘솔에서 한 건씩 세는 대신 여기서 합계를 뽑는다.

   준비물 — 서비스 계정 키
   ─────────────────────
   1. Firebase 콘솔 → ⚙ 프로젝트 설정 → 서비스 계정 → "새 비공개 키 생성"
   2. 받은 json 을 이 저장소 밖에 둔다 (커밋하면 안 된다. 방명록·사진·참석자
      명단을 전부 읽고 지울 수 있는 진짜 비밀키다)
   3. 경로를 환경변수로 넘긴다:
        GOOGLE_APPLICATION_CREDENTIALS=~/wedding-key.json node scripts/pull-rsvp.js */
const fs = require('fs');
const path = require('path');

/* firebase-admin 14 부터는 예전 admin.credential.cert 방식이 사라지고
   하위 경로에서 가져오는 모듈식 API 만 남았다. */
let initializeApp, cert, getFirestore;
try {
  ({ initializeApp, cert } = require('firebase-admin/app'));
  ({ getFirestore } = require('firebase-admin/firestore'));
} catch {
  console.error('firebase-admin 이 없습니다. 먼저 설치해 주세요:\n  npm install firebase-admin');
  process.exit(1);
}

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!keyPath || !fs.existsSync(keyPath)) {
  console.error('서비스 계정 키를 찾지 못했습니다.\n' +
    '  GOOGLE_APPLICATION_CREDENTIALS=/경로/키.json node scripts/pull-rsvp.js');
  process.exit(1);
}

// 프로젝트 주소는 config.js 하나만 보고 간다 (사이트와 어긋날 일이 없게).
const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'config.js'), 'utf8');
const CONFIG = new Function('window', `${src}; return CONFIG;`)({});

initializeApp({
  credential: cert(require(path.resolve(keyPath))),
  projectId: CONFIG.firebase && CONFIG.firebase.projectId,
});

const outPath = path.resolve(process.argv[2] || 'rsvp.csv');
const SIDE = { groom: '신랑측', bride: '신부측' };

// 쉼표·줄바꿈·따옴표가 섞여도 엑셀이 한 칸으로 읽게 감싼다
const cell = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;

const fmt = (ts) => {
  if (!ts || !ts.toDate) return '';
  const d = ts.toDate();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

(async () => {
  const snap = await getFirestore().collection('rsvp').orderBy('createdAt').get();
  if (snap.empty) {
    console.log('아직 전달된 참석 여부가 없습니다.');
    return;
  }

  const rows = snap.docs.map((d) => d.data());

  const head = ['보낸시각', '구분', '성함', '참석', '인원', '식사', '연락처', '전하실 말씀'];
  const csv = [head, ...rows.map((r) => [
    fmt(r.createdAt),
    SIDE[r.side] || r.side,
    r.name,
    r.attending ? '참석' : '불참',
    r.attending ? r.count : '',
    r.meal,
    r.phone,
    r.note,
  ])].map((cols) => cols.map(cell).join(',')).join('\r\n');

  // BOM 을 붙여야 엑셀에서 한글이 깨지지 않는다
  fs.writeFileSync(outPath, '﻿' + csv, 'utf8');

  /* ---------- 집계 ---------- */
  const yes = rows.filter((r) => r.attending);
  const sum = (list) => list.reduce((acc, r) => acc + (Number(r.count) || 0), 0);
  const bySide = (s) => yes.filter((r) => r.side === s);
  const meals    = sum(yes.filter((r) => r.meal === '예정'));
  const mealsTbd = sum(yes.filter((r) => r.meal === '미정'));

  const line = (label, value) => console.log(`  ${label.padEnd(18, ' ')}${value}`);

  console.log(`\n응답 ${rows.length}건 — 참석 ${yes.length}팀 / 불참 ${rows.length - yes.length}팀\n`);
  line('신랑측 참석 인원', `${sum(bySide('groom'))}명 (${bySide('groom').length}팀)`);
  line('신부측 참석 인원', `${sum(bySide('bride'))}명 (${bySide('bride').length}팀)`);
  line('총 참석 인원', `${sum(yes)}명`);
  line('식사 예정 인원', `${meals}명`);
  line('식사 미정 인원', `${mealsTbd}명`);
  console.log(`\n명단 저장: ${outPath}`);
  console.log(`식수는 ${meals}명 ~ ${meals + mealsTbd}명 사이로 보시면 됩니다 (미정 포함).`);
  console.log('실제 참석은 응답보다 적게 오는 편이라, 예식장과 상의해 여유를 두세요.\n');
})().catch((err) => {
  console.error('\n실패했습니다:', err.message);
  process.exit(1);
});
