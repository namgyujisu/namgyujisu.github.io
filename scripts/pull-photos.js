/* 하객이 보내준 사진을 통째로 내려받기
   실행: node scripts/pull-photos.js [받을폴더]

   Firebase 콘솔에서 한 장씩 받는 건 수백 장이면 못 할 짓이라 만들어둔다.
   시놀로지 NAS(패키지 센터의 Node.js)에서도 그대로 돌아간다.

   준비물 — 서비스 계정 키
   ─────────────────────
   1. Firebase 콘솔 → ⚙ 프로젝트 설정 → 서비스 계정 → "새 비공개 키 생성"
   2. 받은 json 을 이 저장소 밖에 둔다 (저장소에 커밋하면 안 된다. 이 키는
      방명록·사진을 전부 읽고 지울 수 있는 진짜 비밀키다)
   3. 경로를 환경변수로 넘긴다:
        GOOGLE_APPLICATION_CREDENTIALS=~/wedding-key.json node scripts/pull-photos.js

   이미 받은 파일은 건너뛰므로 여러 번 돌려도 안전하다. */
const fs = require('fs');
const path = require('path');

let admin;
try {
  admin = require('firebase-admin');
} catch {
  console.error('firebase-admin 이 없습니다. 먼저 설치해 주세요:\n  npm install firebase-admin');
  process.exit(1);
}

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!keyPath || !fs.existsSync(keyPath)) {
  console.error('서비스 계정 키를 찾지 못했습니다.\n' +
    '  GOOGLE_APPLICATION_CREDENTIALS=/경로/키.json node scripts/pull-photos.js');
  process.exit(1);
}

// 버킷 주소는 config.js 하나만 보고 간다 (사이트와 어긋날 일이 없게).
const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'config.js'), 'utf8');
const CONFIG = new Function('window', `${src}; return CONFIG;`)({});
const bucketName = CONFIG.firebase && CONFIG.firebase.storageBucket;
if (!bucketName) {
  console.error('config.js 의 firebase.storageBucket 이 비어 있습니다.');
  process.exit(1);
}

const outRoot = path.resolve(process.argv[2] || 'guest-photos');
const PREFIX = 'guest-photos/';

admin.initializeApp({
  credential: admin.credential.cert(require(path.resolve(keyPath))),
  storageBucket: bucketName,
});

(async () => {
  const bucket = admin.storage().bucket();
  console.log(`버킷 ${bucketName} 에서 ${PREFIX} 를 읽는 중…`);

  const [files] = await bucket.getFiles({ prefix: PREFIX });
  const real = files.filter((f) => !f.name.endsWith('/'));
  if (!real.length) {
    console.log('아직 받은 사진이 없습니다.');
    return;
  }

  let saved = 0, skipped = 0, bytes = 0;
  for (const file of real) {
    const dest = path.join(outRoot, file.name.slice(PREFIX.length));
    const size = Number(file.metadata.size || 0);

    // 크기까지 같으면 이미 받은 것으로 본다
    if (fs.existsSync(dest) && fs.statSync(dest).size === size) { skipped += 1; continue; }

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await file.download({ destination: dest });
    saved += 1; bytes += size;
    process.stdout.write(`\r받는 중… ${saved}장`);
  }

  console.log(`\n\n완료 — 새로 ${saved}장 (${(bytes / 1024 / 1024).toFixed(1)}MB), 건너뜀 ${skipped}장`);
  console.log(`저장 위치: ${outRoot}`);
  console.log('\n다 옮기셨으면 Firebase 콘솔 → Storage 에서 원본을 지우면 보관 요금도 0 이 됩니다.');
})().catch((err) => {
  console.error('\n실패했습니다:', err.message);
  process.exit(1);
});
