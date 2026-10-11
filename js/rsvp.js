/* =============================================================
   참석여부 — Firebase Firestore

   방명록과 달리 '쓰기 전용'이다. 보안 규칙에서 read 를 막아두므로 목록을
   불러오지 않는다. 누가 오는지 · 몇 명 오는지는 다른 하객 눈에 띌 정보가
   아니기 때문이다. 집계는 Firebase 콘솔이나 scripts/pull-rsvp.js 로 꺼낸다.

   읽지 않으니 무료 할당량(하루 쓰기 2만 건)만 쓰고 요금은 들지 않는다.
   ============================================================= */
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getFirestore, collection, addDoc, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const CONFIG = window.CONFIG;
const $ = (sel, root = document) => root.querySelector(sel);

const section  = $('.section--rsvp');
const formEl   = $('[data-rsvp-form]');
const statusEl = $('[data-rsvp-status]');
const doneEl   = $('[data-rsvp-done]');
const doneMsgEl = $('[data-rsvp-done-msg]');
const againEl  = $('[data-rsvp-again]');
const yesEl    = $('[data-rsvp-yes]');
const foldEl   = $('[data-rsvp-fold]');
const toggleEl = $('[data-rsvp-toggle]');
const panelEl  = $('[data-rsvp-panel]');
const mealEl   = $('[data-rsvp-meal]');
const phoneEl  = $('[data-rsvp-phone]');
const totalEl  = $('[data-rsvp-total]');

/* 섹션은 hidden 으로 시작한다. 설정이 꺼져 있거나 firebase 가 비어 있으면
   그대로 감춘 채 끝낸다. 저장이 안 되는 폼을 보여주면 하객은 전달됐다고
   믿고 떠나므로, 보이지 않는 편이 낫다. */
if (!CONFIG.rsvp || !CONFIG.rsvp.enabled
    || !CONFIG.firebase || !CONFIG.firebase.projectId) {
  throw new Error('rsvp 가 꺼져 있거나 firebase 설정이 비어 있어 초기화하지 않았습니다.');
}

section.hidden = false;

/* ---------- 펼치기 ----------
   폼을 통째로 펼쳐두면 섹션이 길고 어수선해진다. '마음 전하실 곳' 과 같은
   방식으로 접어두고, 누를 때만 연다. 접힌 동안에는 inert 로 막아
   눈에 안 보이는 입력칸에 탭으로 커서가 들어가는 일이 없게 한다. */
const setOpen = (open) => {
  foldEl.classList.toggle('is-open', open);
  toggleEl.setAttribute('aria-expanded', String(open));
  if (open) panelEl.removeAttribute('inert');
  else panelEl.setAttribute('inert', '');
};
toggleEl.addEventListener('click', () => setOpen(!foldEl.classList.contains('is-open')));

/* ---------- 마감 확인 ----------
   deadline 은 '그 날까지 받는다'는 뜻이라 당일 자정까지 열어둔다. */
const closed = (() => {
  if (!CONFIG.rsvp.deadline) return false;
  const end = new Date(`${CONFIG.rsvp.deadline}T23:59:59+09:00`);
  return Number.isFinite(end.getTime()) && Date.now() > end.getTime();
})();

const showDone = (msg, canRedo) => {
  formEl.hidden = true;
  doneEl.hidden = false;
  doneMsgEl.textContent = msg;
  againEl.hidden = !canRedo;
};

/* 이미 보낸 분에게 빈 폼을 다시 들이밀면 두 번 보내게 된다.
   브라우저에만 남는 표시이므로 차단이 아니라 안내로만 쓴다. */
const SENT_KEY = 'rsvp-sent';
const readSent = () => {
  try { return localStorage.getItem(SENT_KEY); } catch { return null; }
};
const writeSent = (name) => {
  try { localStorage.setItem(SENT_KEY, name || '1'); } catch { /* 사생활 보호 모드 */ }
};

if (closed) {
  showDone('참석 여부 전달은 마감되었습니다. 그래도 꼭 와주세요.', false);
} else {
  const sent = readSent();
  if (sent) showDone('참석 여부를 이미 전달해 주셨습니다. 고맙습니다.', true);
}

againEl.addEventListener('click', () => {
  doneEl.hidden = true;
  formEl.hidden = false;
  statusEl.textContent = '';
});

/* ---------- 참석/불참에 따라 묻는 항목을 바꾼다 ---------- */
/* 고른 숫자는 '동행인 수' 인데 저장은 본인 포함 총 인원으로 한다.
   헷갈리기 쉬운 지점이라 고른 즉시 몇 명으로 기록되는지 보여준다. */
const total = () => Number(formEl.count.value || 0) + 1;
const syncTotal = () => { totalEl.textContent = `본인 포함 총 ${total()}명으로 기록됩니다.`; };

const syncFields = () => {
  const yes = formEl.attending.value === 'yes';
  yesEl.hidden = !yes;
  // 불참이면 인원·식사는 물어볼 필요가 없다
  if (!CONFIG.rsvp.askMeal && mealEl) mealEl.hidden = true;
  if (!CONFIG.rsvp.askPhone && phoneEl) phoneEl.hidden = true;
};
formEl.addEventListener('change', (e) => {
  if (e.target.name === 'attending') syncFields();
  if (e.target.name === 'count') syncTotal();
});
syncFields();
syncTotal();

/* ---------- 전달하기 ---------- */
const col = collection(
  getFirestore(getApps().length ? getApp() : initializeApp(CONFIG.firebase)),
  'rsvp'
);

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = formEl.name_.value.trim();
  if (!name) return;

  const yes = formEl.attending.value === 'yes';
  const btn = $('[data-rsvp-submit]');

  btn.disabled = true;
  btn.textContent = '전달하는 중...';
  statusEl.textContent = '';

  try {
    /* 보안 규칙이 모든 필드의 타입을 확인하므로, 빈 값도 빼지 않고
       빈 문자열로 함께 보낸다. 선택 항목이라고 생략하면 규칙에서 막힌다. */
    await addDoc(col, {
      side: formEl.side.value,                                   // groom | bride
      name,
      attending: yes,
      count: yes ? total() : 0,                                  // 본인 포함
      companions: yes ? formEl.companions.value.trim() : '',
      meal: yes && CONFIG.rsvp.askMeal ? formEl.meal.value : '',
      phone: CONFIG.rsvp.askPhone ? formEl.phone.value.trim() : '',
      note: formEl.note.value.trim(),
      createdAt: serverTimestamp(),
    });
    writeSent(name);
    showDone(yes
      ? '참석 여부를 전달했습니다. 그날 꼭 뵙겠습니다.'
      : '참석 여부를 전달했습니다. 마음 보내주셔서 고맙습니다.', true);
  } catch (err) {
    console.error('[rsvp] 전달 실패', err);
    statusEl.textContent = '전달하지 못했습니다. 잠시 후 다시 시도해 주세요.';
  } finally {
    btn.disabled = false;
    btn.textContent = '전달하기';
  }
});
