/* =============================================================
   main.js — config.js 의 CONFIG 를 읽어 페이지를 그립니다.
   ============================================================= */
(function () {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const pad2 = (n) => String(n).padStart(2, '0');

  /* ---------- 아이콘 ---------- */
  const ICON = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    sms:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"/></svg>',
    subway:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 10h16M8 21l-2 2M16 21l2 2M8.5 13.5h.01M15.5 13.5h.01M9 17h6"/></svg>',
    bus:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M3 10h18M7 21v-2M17 21v-2M7.5 14h.01M16.5 14h.01"/></svg>',
    car:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M3 13l1.7-4.9A2 2 0 0 1 6.6 6.8h10.8a2 2 0 0 1 1.9 1.3L21 13v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4z"/><path d="M6.5 16h.01M17.5 16h.01M3 13h18"/></svg>',
    link:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>',
    kakao: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.9 3 2.8 6.3 2.8 10.4c0 2.6 1.7 4.9 4.3 6.2l-1 3.8c-.1.3.3.6.6.4l4.5-3c.3 0 .5.1.8.1 5.1 0 9.2-3.3 9.2-7.5S17.1 3 12 3z"/></svg>',
  };

  /* ---------- 날짜 ---------- */
  const D = CONFIG.date;
  const WEDDING = new Date(D.year, D.month - 1, D.day, D.hour, D.minute);
  const DOW_KR = ['일', '월', '화', '수', '목', '금', '토'];
  const DOW_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const ampm    = D.hour < 12 ? '오전' : '오후';
  const hour12  = D.hour % 12 === 0 ? 12 : D.hour % 12;
  const minText = D.minute ? ` ${D.minute}분` : '';

  /* =========================================================
     1. HERO
     ========================================================= */
  $('[data-hero-date]').textContent =
    `${D.year}. ${pad2(D.month)}. ${pad2(D.day)}. ${DOW_EN[WEDDING.getDay()]}`;
  $('[data-hero-venue]').textContent =
    `${ampm} ${hour12}시${minText} · ${CONFIG.venue.name}`;

  /* =========================================================
     2. 인사말
     ========================================================= */
  $('[data-invite-poem]').innerHTML = CONFIG.greeting.poem.join('<br />');
  $('[data-invite-body]').innerHTML = CONFIG.greeting.body
    .map((line) => (line === '' ? '<span class="sp"></span>' : line))
    .join('<br />')
    .replace(/<br \/><span class="sp"><\/span><br \/>/g, '<span class="sp"></span>');

  const g = CONFIG.groom;
  const b = CONFIG.bride;
  $('[data-invite-parents]').innerHTML = `
    <p class="parents__row">
      ${g.father.name}<span class="dot">·</span>${g.mother.name}
      <span class="rel">의 ${g.role}</span><span class="child">${g.name}</span>
    </p>
    <p class="parents__row">
      ${b.father.name}<span class="dot">·</span>${b.mother.name}
      <span class="rel">의 ${b.role}</span><span class="child">${b.name}</span>
    </p>`;

  /* =========================================================
     3. 연락하기
     ========================================================= */
  const telBtns = (phone) => `
    <span class="contact__actions">
      <a class="icon-btn" href="tel:${phone}" aria-label="전화하기">${ICON.phone}</a>
      <a class="icon-btn" href="sms:${phone}" aria-label="문자하기">${ICON.sms}</a>
    </span>`;

  const contactCard = (side, person) => `
    <div class="contact__group">
      <div class="contact__card">
        <p class="contact__side">${side}</p>
        <div class="contact__main">
          <span class="contact__name">${person.name}</span>
          ${telBtns(person.phone)}
        </div>
        <div class="contact__parents">
          <div class="contact__parent">
            <span class="rel">아버지</span>
            <span class="row">${person.father.name}${telBtns(person.father.phone)}</span>
          </div>
          <div class="contact__parent">
            <span class="rel">어머니</span>
            <span class="row">${person.mother.name}${telBtns(person.mother.phone)}</span>
          </div>
        </div>
      </div>
    </div>`;

  $('[data-contact]').innerHTML = contactCard('GROOM 신랑', g) + contactCard('BRIDE 신부', b);

  /* =========================================================
     4. 예식 안내 — 달력 + D-day
     ========================================================= */
  $('[data-date-title]').textContent =
    `${D.year}년 ${D.month}월 ${D.day}일 ${DOW_KR[WEDDING.getDay()]}요일`;
  $('[data-date-sub]').textContent =
    `${ampm} ${hour12}시${minText} · ${CONFIG.venue.name} ${CONFIG.venue.hall}`;

  (function renderCalendar() {
    const first = new Date(D.year, D.month - 1, 1).getDay();
    const last  = new Date(D.year, D.month, 0).getDate();

    let html = '<div class="cal__grid">';
    DOW_KR.forEach((d, i) => {
      html += `<div class="cal__dow${i === 0 ? ' cal__dow--sun' : ''}">${d}</div>`;
    });
    for (let i = 0; i < first; i++) html += '<div class="cal__day cal__day--empty"></div>';
    for (let day = 1; day <= last; day++) {
      const dow = (first + day - 1) % 7;
      const cls = [
        'cal__day',
        dow === 0 ? 'cal__day--sun' : '',
        day === D.day ? 'cal__day--wedding' : '',
      ].filter(Boolean).join(' ');
      html += `<div class="${cls}"><span>${day}</span></div>`;
    }
    html += '</div>';
    $('[data-calendar]').innerHTML = html;
  })();

  (function renderDday() {
    const today = new Date();
    const a = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const c = new Date(D.year, D.month - 1, D.day);
    const diff = Math.round((c - a) / 86400000);

    const names = `${g.name} <span style="color:var(--gold)">♥</span> ${b.name}`;
    let msg;
    if (diff > 0)       msg = `${names} 의 결혼식이 <b>${diff}일</b> 남았습니다.`;
    else if (diff === 0) msg = `오늘은 ${names} 의 결혼식 날입니다.`;
    else                msg = `${names} 결혼한 지 <b>${-diff}일</b> 되었습니다.`;
    $('[data-dday]').innerHTML = msg;
  })();

  /* =========================================================
     5. 갤러리 + 라이트박스
     ========================================================= */
  const photos = CONFIG.gallery;
  $('[data-gallery]').innerHTML = photos
    .map((src, i) => `<button type="button" data-idx="${i}" aria-label="사진 ${i + 1} 크게 보기">
        <img src="${src}" alt="웨딩 사진 ${i + 1}" loading="lazy" />
      </button>`)
    .join('');

  const lb      = $('[data-lightbox]');
  const lbImg   = $('[data-lb-img]');
  const lbCount = $('[data-lb-count]');
  let lbIdx = 0;

  const lbShow = (i) => {
    lbIdx = (i + photos.length) % photos.length;
    lbImg.src = photos[lbIdx];
    lbImg.alt = `웨딩 사진 ${lbIdx + 1}`;
    lbCount.textContent = `${lbIdx + 1} / ${photos.length}`;
  };
  const lbOpen  = (i) => { lbShow(i); lb.hidden = false; document.body.style.overflow = 'hidden'; };
  const lbClose = ()  => { lb.hidden = true;  document.body.style.overflow = ''; };

  $('[data-gallery]').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-idx]');
    if (btn) lbOpen(Number(btn.dataset.idx));
  });
  $('[data-lb-close]').addEventListener('click', lbClose);
  $('[data-lb-prev]').addEventListener('click', (e) => { e.stopPropagation(); lbShow(lbIdx - 1); });
  $('[data-lb-next]').addEventListener('click', (e) => { e.stopPropagation(); lbShow(lbIdx + 1); });
  lb.addEventListener('click', (e) => { if (e.target === lb) lbClose(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape')     lbClose();
    if (e.key === 'ArrowLeft')  lbShow(lbIdx - 1);
    if (e.key === 'ArrowRight') lbShow(lbIdx + 1);
  });

  // 모바일 스와이프
  let touchX = null;
  lb.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) lbShow(lbIdx + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  /* =========================================================
     6. 오시는 길
     ========================================================= */

  // 외부 지도 SDK 를 한 번만 불러온다. 실패하면 reject → 구글 임베드로 폴백.
  const scriptCache = {};
  function loadScript(src) {
    if (scriptCache[src]) return scriptCache[src];
    scriptCache[src] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error(src));
      document.head.appendChild(s);
    });
    return scriptCache[src];
  }

  function googleMap(box, v, m) {
    box.innerHTML =
      `<iframe title="${v.name} 위치" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
         src="https://maps.google.com/maps?q=${v.lat},${v.lng}&z=${m.zoom || 16}&hl=ko&output=embed"></iframe>`;
  }

  async function kakaoMap(box, v, m) {
    await loadScript(`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${m.kakaoAppKey}&autoload=false`);
    await new Promise((resolve) => kakao.maps.load(resolve));

    box.innerHTML = '';
    const center = new kakao.maps.LatLng(v.lat, v.lng);
    const map = new kakao.maps.Map(box, { center, level: m.kakaoLevel || 4 });
    // 페이지를 스크롤하다 지도 위에서 확대되는 사고를 막는다 (버튼으로만 확대).
    map.setZoomable(false);
    map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);

    const marker = new kakao.maps.Marker({ map, position: center });
    // 기본 InfoWindow 는 시스템 폰트의 각진 흰 박스라 청첩장 톤과 안 맞는다.
    // CustomOverlay 로 바꾸면 내용이 그냥 우리 HTML 이라 CSS 가 다 먹는다.
    new kakao.maps.CustomOverlay({
      map,
      position: center,
      xAnchor: 0.5,          // 마커 기준 가운데
      yAnchor: 2.2,          // 마커 머리 위로 띄운다
      content: `<div class="map__pin">${v.name}</div>`,
    });

    // 마커를 누르면 카카오맵 장소 페이지로 (길찾기 · 로드뷰가 거기 다 있다).
    kakao.maps.event.addListener(marker, 'click', () => {
      window.open(v.kakaoPlaceUrl || `https://map.kakao.com/?q=${encodeURIComponent(v.name)}`,
        '_blank', 'noopener');
    });
  }

  async function naverMap(box, v, m) {
    // 신규 네이버 클라우드 콘솔은 ncpKeyId, 구 콘솔 키는 ncpClientId 를 씁니다.
    // 지도가 비어 보이면 아래 파라미터 이름을 ncpClientId 로 바꿔보세요.
    await loadScript(`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${m.naverClientId}`);

    box.innerHTML = '';
    const center = new naver.maps.LatLng(v.lat, v.lng);
    const map = new naver.maps.Map(box, {
      center,
      zoom: m.zoom || 16,
      scrollWheel: false,   // 페이지 스크롤 보호
      logoControl: true,
      mapDataControl: false,
    });
    const marker = new naver.maps.Marker({ map, position: center });
    new naver.maps.InfoWindow({
      content: `<div style="padding:6px 10px;font-size:12px;white-space:nowrap">${v.name}</div>`,
      borderWidth: 1,
      disableAnchor: false,
    }).open(map, marker);

    naver.maps.Event.addListener(marker, 'click', () => {
      window.open(`https://map.naver.com/p/search/${encodeURIComponent(v.name)}`, '_blank', 'noopener');
    });
  }

  function renderMap(box, v, m) {
    const provider = m.provider || 'google';
    const key = provider === 'kakao' ? m.kakaoAppKey : provider === 'naver' ? m.naverClientId : null;

    if (provider === 'google' || !key) {
      googleMap(box, v, m);   // 키가 아직 없으면 조용히 구글로
      return;
    }

    // SDK 로딩 전에는 구글 지도를 띄워두고, 준비되면 갈아끼운다.
    googleMap(box, v, m);
    const draw = provider === 'kakao' ? kakaoMap : naverMap;
    draw(box, v, m).catch((err) => {
      console.warn(`[map] ${provider} 지도를 불러오지 못해 구글 지도로 대체합니다.`, err);
      googleMap(box, v, m);
    });
  }

  const v = CONFIG.venue;
  $('[data-venue-name]').textContent = `${v.name} ${v.hall}`;
  $('[data-venue-addr]').innerHTML   = `${v.address} ${v.addressDetail}<br />Tel. ${v.tel}`;

  renderMap($('[data-map]'), v, CONFIG.map || {});

  const q = encodeURIComponent(v.name);
  $('[data-map-links]').innerHTML = `
    <a class="map__link" href="https://map.naver.com/p/search/${q}" target="_blank" rel="noopener">네이버 지도</a>
    <a class="map__link" href="https://map.kakao.com/?q=${q}" target="_blank" rel="noopener">카카오맵</a>
    <a class="map__link" href="https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}" target="_blank" rel="noopener">구글 지도</a>`;

  $('[data-transport]').innerHTML = v.transport
    .map((t) => `
      <div class="transport__item">
        <p class="transport__head">${ICON[t.icon] || ''}<span>${t.title}</span></p>
        <p class="transport__lines">${t.lines.join('<br />')}</p>
      </div>`)
    .join('');

  /* =========================================================
     7. 마음 전하실 곳
     ========================================================= */
  const accSection = (key, data) => `
    <div class="acc__item" data-acc>
      <button type="button" class="acc__head" data-acc-head aria-expanded="false">
        <span>${data.label} 마음 전하실 곳</span><span class="chev"></span>
      </button>
      <div class="acc__body"><div class="acc__inner">
        ${data.list.map((a) => `
          <div class="acc__row">
            <span class="acc__who">${a.relation}<b>${a.name}</b></span>
            <span class="acc__num">${a.bank}<br />${a.number}</span>
            <button type="button" class="copy-btn" data-copy="${a.bank} ${a.number}">복사</button>
          </div>`).join('')}
      </div></div>
    </div>`;

  $('[data-accounts]').innerHTML =
    accSection('groom', CONFIG.accounts.groom) + accSection('bride', CONFIG.accounts.bride);

  $('[data-accounts]').addEventListener('click', (e) => {
    const head = e.target.closest('[data-acc-head]');
    if (head) {
      const item = head.closest('[data-acc]');
      const open = item.classList.toggle('is-open');
      head.setAttribute('aria-expanded', String(open));
    }
  });

  /* =========================================================
     8. 복사 + 공유
     ========================================================= */
  const toast = $('[data-toast]');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), 1800);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = el('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    showToast('복사되었습니다');
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-copy]');
    if (btn) copyText(btn.dataset.copy);
  });

  // 카카오톡 공유는 SDK 가 뜨고 키가 있을 때만 노출한다.
  // (링크만 붙여넣는 것과 달리 이미지 · 설명 · 버튼이 있는 카드로 나간다.)
  const kakaoReady = (() => {
    const key = (CONFIG.map || {}).kakaoAppKey;
    if (!key || typeof Kakao === 'undefined') return false;
    try {
      if (!Kakao.isInitialized()) Kakao.init(key);
      return true;
    } catch (err) {
      console.warn('[share] 카카오 SDK 초기화 실패', err);
      return false;
    }
  })();

  $('[data-share]').innerHTML = `
    ${kakaoReady ? `<button type="button" class="share__btn share__btn--kakao" data-share-kakao>${ICON.kakao}<span>카카오톡 공유</span></button>` : ''}
    <button type="button" class="share__btn" data-share-native>${ICON.share}<span>공유하기</span></button>
    <button type="button" class="share__btn" data-share-link>${ICON.link}<span>링크 복사</span></button>`;

  if (kakaoReady) {
    const sh   = CONFIG.share;
    const url  = sh.url || location.href;
    const link = { mobileWebUrl: url, webUrl: url };
    $('[data-share-kakao]').addEventListener('click', () => {
      try {
        Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: sh.title,
            description: sh.description,
            imageUrl: sh.image,
            link,
          },
          buttons: [{ title: sh.buttonText || '청첩장 보기', link }],
        });
      } catch (err) {
        // 콘솔에만 찍으면 휴대폰에서는 눌러도 아무 반응 없는 것처럼 보인다.
        // 원인을 화면에 띄우고, 공유는 링크 복사로 물러난다.
        console.warn('[share] 카카오톡 공유 실패', err);
        showToast(`카카오톡 공유 실패: ${err && err.message ? err.message : err}`);
        setTimeout(() => copyText(url), 2000);
      }
    });
  }

  $('[data-share-link]').addEventListener('click', () => copyText(location.href));
  $('[data-share-native]').addEventListener('click', async () => {
    const payload = {
      title: CONFIG.share.title,
      text:  CONFIG.share.description,
      url:   location.href,
    };
    if (navigator.share) {
      try { await navigator.share(payload); } catch { /* 사용자가 취소 */ }
    } else {
      copyText(location.href);
    }
  });

  /* =========================================================
     9. 스크롤 등장 효과
     ========================================================= */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach((n) => io.observe(n));
})();
