/* =============================================================
   하객 사진 받기 — Firebase Storage

   읽기 없이 쓰기만 하는 구조다. 보안 규칙에서 read 를 막아두므로 올린 사람도,
   주소를 알아낸 사람도 사진을 되볼 수 없다. 갤러리로 보여주지 않기 때문에
   하객이 내려받는 트래픽이 0 이고, 요금이 나가는 쪽이 바로 그 트래픽이라
   원본 화질 그대로 받아도 비용이 거의 들지 않는다.

   CONFIG.firebase 가 비어 있으면 섹션을 통째로 감추고 조용히 멈춘다.
   ============================================================= */
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getStorage, ref, uploadBytesResumable,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js';

const CONFIG = window.CONFIG;
const $ = (sel, root = document) => root.querySelector(sel);

const section = $('.section--photos');
const formEl  = $('[data-up-form]');
const fileEl  = $('[data-up-file]');
const pickEl  = $('[data-up-pick]');
const barEl   = $('[data-up-bar]');
const statusEl = $('[data-up-status]');

/* 콘솔 설정(Blaze · Storage · 보안 규칙)을 마치고 CONFIG.photos.enabled 를
   켜기 전까지는 섹션을 숨긴다. 준비 안 된 기능을 하객에게 보일 이유가 없다. */
if (!CONFIG.photos || !CONFIG.photos.enabled
    || !CONFIG.firebase || !CONFIG.firebase.projectId || !CONFIG.firebase.storageBucket) {
  if (section) section.hidden = true;
  throw new Error('firebase 설정이 비어 있어 사진 받기를 초기화하지 않았습니다.');
}

// guestbook.js 가 이미 같은 설정으로 앱을 만들었을 수 있다. 중복 초기화는 에러다.
const app = getApps().length ? getApp() : initializeApp(CONFIG.firebase);
const storage = getStorage(app);

const MAX_BYTES = 20 * 1024 * 1024;   // 규칙과 같은 값이어야 한다
const MAX_FILES = 30;                 // 한 번에 고를 수 있는 장수

/* 파일명에 한글·공백·특수문자가 섞이면 경로가 지저분해진다.
   확장자만 살리고 나머지는 안전한 문자로 눌러쓴다. */
const safe = (s, fallback) => {
  const out = String(s || '').trim().replace(/[^\w가-힣.-]+/g, '_').slice(0, 40);
  return out || fallback;
};

const stamp = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
};

const setProgress = (ratio) => {
  barEl.hidden = false;
  barEl.firstElementChild.style.width = `${Math.round(ratio * 100)}%`;
};

pickEl.addEventListener('click', () => fileEl.click());

// 폼 안에 있으므로 엔터로 제출되는 것을 막는다
formEl.addEventListener('submit', (e) => e.preventDefault());

fileEl.addEventListener('change', async () => {
  const picked = [...fileEl.files];
  fileEl.value = '';                       // 같은 사진을 다시 고를 수 있게 비운다
  if (!picked.length) return;

  const tooMany = picked.length > MAX_FILES;
  const files = picked.slice(0, MAX_FILES).filter((f) => {
    if (f.size > MAX_BYTES) return false;
    return f.type.startsWith('image/');
  });
  const skipped = Math.min(picked.length, MAX_FILES) - files.length;

  if (!files.length) {
    statusEl.textContent = '올릴 수 있는 사진이 없습니다. (사진 파일, 한 장당 20MB 이하)';
    return;
  }

  const who = safe(formEl.name_.value, '이름없음');
  const dir = `guest-photos/${who}`;

  pickEl.disabled = true;
  let done = 0;
  let failed = 0;

  for (const [i, file] of files.entries()) {
    const ext  = (file.name.match(/\.[a-zA-Z0-9]+$/) || ['.jpg'])[0].toLowerCase();
    const rand = Math.random().toString(36).slice(2, 8);
    const path = `${dir}/${stamp()}-${rand}${ext}`;

    statusEl.textContent = `${files.length}장 중 ${i + 1}번째 올리는 중…`;

    try {
      await new Promise((resolve, reject) => {
        const task = uploadBytesResumable(ref(storage, path), file, {
          contentType: file.type,
          // 파일명을 눌러 썼으므로 원본 이름은 메타데이터에 남겨둔다
          customMetadata: { uploader: String(formEl.name_.value || '').slice(0, 20), original: file.name },
        });
        task.on('state_changed',
          (snap) => setProgress((i + snap.bytesTransferred / snap.totalBytes) / files.length),
          reject,
          resolve);
      });
      done += 1;
    } catch (err) {
      console.warn('[photos] 업로드 실패', file.name, err);
      failed += 1;
    }
  }

  setProgress(1);
  pickEl.disabled = false;

  const notes = [];
  if (failed)  notes.push(`${failed}장은 실패했습니다`);
  if (skipped) notes.push(`${skipped}장은 형식이나 용량 때문에 제외했습니다`);
  if (tooMany) notes.push(`한 번에 ${MAX_FILES}장까지만 올라갑니다`);

  statusEl.textContent = done
    ? `${done}장 보내주셔서 고맙습니다.${notes.length ? ' ' + notes.join('. ') + '.' : ''}`
    : `보내지 못했습니다. ${notes.join('. ')}`;

  if (done) setTimeout(() => { barEl.hidden = true; setProgress(0); }, 1500);
});
