/* =============================================================
   방명록 — Firebase Firestore
   CONFIG.firebase 가 비어 있으면 "준비 중"으로 표시하고 조용히 멈춘다.
   ============================================================= */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getFirestore, collection, addDoc, deleteDoc, doc, getDoc,
  query, orderBy, limit, onSnapshot, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const CONFIG = window.CONFIG;
const $ = (sel, root = document) => root.querySelector(sel);

const listEl  = $('[data-gb-list]');
const formEl  = $('[data-gb-form]');
const emptyEl = $('[data-gb-empty]');

/* 설정 전이면 안내만 남기고 종료 */
if (!CONFIG.firebase || !CONFIG.firebase.projectId) {
  formEl.hidden = true;
  emptyEl.textContent = '방명록 준비 중입니다.';
  throw new Error('firebase 설정이 비어 있어 방명록을 초기화하지 않았습니다.');
}

const db  = getFirestore(initializeApp(CONFIG.firebase));
const col = collection(db, 'guestbook');

/* ---------- 비밀번호 해싱 ----------
   방명록은 누구나 읽을 수 있으므로 비밀번호를 그대로 저장하면 노출된다.
   되돌릴 수 없는 해시만 저장하고, 삭제할 때 해시끼리 비교한다.        */
const SALT = 'namgyujisu-wedding';
async function hash(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(SALT + text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const fmtDate = (ts) => {
  const d = ts?.toDate ? ts.toDate() : new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}. ${p(d.getMonth() + 1)}. ${p(d.getDate())}`;
};

/* ---------- 목록 실시간 표시 ---------- */
onSnapshot(
  query(col, orderBy('createdAt', 'desc'), limit(200)),
  (snap) => {
    if (snap.empty) {
      listEl.innerHTML = '';
      emptyEl.hidden = false;
      emptyEl.textContent = '첫 번째 축하 메시지를 남겨주세요.';
      return;
    }
    emptyEl.hidden = true;
    listEl.innerHTML = snap.docs.map((d) => {
      const v = d.data();
      return `
        <li class="gb__item">
          <div class="gb__head">
            <span class="gb__name">${esc(v.name)}</span>
            <span class="gb__date">${fmtDate(v.createdAt)}</span>
            <button type="button" class="gb__del" data-del="${d.id}" aria-label="삭제">&times;</button>
          </div>
          <p class="gb__msg">${esc(v.message)}</p>
        </li>`;
    }).join('');
  },
  (err) => {
    console.error(err);
    emptyEl.hidden = false;
    emptyEl.textContent = '방명록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
  }
);

/* ---------- 글 남기기 ---------- */
formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = $('[data-gb-submit]');
  const name = formEl.name_.value.trim();
  const pw   = formEl.pw.value.trim();
  const msg  = formEl.message.value.trim();

  if (!name || !pw || !msg) return;
  if (pw.length < 4) { alert('비밀번호는 4자 이상으로 입력해 주세요.'); return; }

  btn.disabled = true;
  btn.textContent = '남기는 중...';
  try {
    await addDoc(col, {
      name,
      message: msg,
      pwHash: await hash(pw),
      createdAt: serverTimestamp(),
    });
    formEl.reset();
  } catch (err) {
    console.error(err);
    alert('메시지를 남기지 못했습니다. 잠시 후 다시 시도해 주세요.');
  } finally {
    btn.disabled = false;
    btn.textContent = '남기기';
  }
});

/* ---------- 삭제 (비밀번호 확인) ---------- */
listEl.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-del]');
  if (!btn) return;

  const pw = prompt('작성하실 때 입력한 비밀번호를 넣어주세요.');
  if (pw === null) return;

  // 해시를 DOM 에 심어두면 그대로 노출되므로, 삭제할 때만 문서에서 읽어 비교한다
  const target = btn.dataset.del;
  const snap = await getDoc(doc(db, 'guestbook', target));
  if (!snap.exists()) return;

  if (snap.data().pwHash !== await hash(pw)) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  try {
    await deleteDoc(doc(db, 'guestbook', target));
  } catch (err) {
    console.error(err);
    alert('삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }
});
