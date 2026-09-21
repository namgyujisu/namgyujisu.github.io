/* =============================================================
   청첩장 설정 파일 — 이 파일만 수정하면 사이트 내용이 바뀝니다.
   TODO 표시된 곳은 실제 정보로 채워주세요.
   ============================================================= */

const CONFIG = {
  /* ---------- 기본 정보 ---------- */
  groom: {
    name: '박남규',
    nameEn: 'Namgyu',
    role: '아들',            // 장남 / 차남 / 아들
    phone: '010-0000-0000',  // TODO
    father: { name: '박○○', phone: '010-0000-0000' }, // TODO
    mother: { name: '○○○', phone: '010-0000-0000' },  // TODO
  },
  bride: {
    name: '염지수',
    nameEn: 'Jisu',
    role: '딸',              // 장녀 / 차녀 / 딸
    phone: '010-0000-0000',  // TODO
    father: { name: '염○○', phone: '010-0000-0000' }, // TODO
    mother: { name: '○○○', phone: '010-0000-0000' },  // TODO
  },

  /* ---------- 예식 일시 ---------- */
  // 2027년 10월 17일 일요일 (hour 는 24시간제, TODO: 예식 시간 확정되면 수정)
  date: { year: 2027, month: 10, day: 17, hour: 13, minute: 0 },

  /* ---------- 예식장 ---------- */
  venue: {
    name: '노블발렌티 삼성',
    hall: '5층 채플홀',
    address: '서울 강남구 봉은사로 637',
    addressDetail: '(삼성동 109-6)',
    tel: '02-540-0711',
    // 카카오맵 장소 정보 기준 실좌표 (노블발렌티 삼성점, 봉은사로 637)
    lat: 37.515334,
    lng: 127.064832,
    // 지도앱 바로가기. 각 앱의 장소 페이지로 직접 연결된다.
    kakaoMapUrl: 'https://place.map.kakao.com/17157328',
    naverMapUrl: 'https://map.naver.com/?title=%EB%85%B8%EB%B8%94%EB%B0%9C%EB%A0%8C%ED%8B%B0%20%EC%82%BC%EC%84%B1%EC%A0%90&menu=location&app=Y&pinType=site&lng=127.0648868&appMenu=location&version=2&lat=37.5153463&pinId=12390329',
    tmapUrl: 'https://tmap.life/7b38887a',
    transport: [
      {
        icon: 'subway',
        title: '지하철',
        lines: [
          '9호선 봉은사역 4번 출구 → 도보 3분',
          '2호선 삼성역 7번 출구 → 도보 10분 (셔틀버스 운행)',
        ],
      },
      {
        icon: 'bus',
        title: '버스',
        lines: [
          '간선 143, 146, 301, 342, 401',
          '지선 2413, 3411, 4318',
        ],
      },
      {
        icon: 'car',
        title: '자가용 · 주차',
        lines: [
          '내비게이션 "노블발렌티 삼성" 검색',
          '건물 내 주차장 이용 (2시간 무료)',
        ],
      },
    ],
  },

  /* ---------- 지도 ----------
     provider 를 바꾸면 '오시는 길' 지도가 바뀝니다.
       'image'  — 예식장 약도 이미지 (기본값. 키도 SDK 도 필요 없다)
       'kakao'  — 카카오맵  (kakaoAppKey 필요)
       'naver'  — 네이버지도 (naverClientId 필요)
       'google' — 구글지도  (키 불필요, 기본 폴백)
     키가 비어 있거나 로딩에 실패하면 자동으로 구글 임베드로 대체되므로
     키를 넣기 전에도 지도는 계속 보입니다.

     · 카카오 키: https://developers.kakao.com → 내 애플리케이션 → 앱 키 →
       "JavaScript 키". 그다음 [앱 설정 → 플랫폼 → Web] 에 사이트 도메인
       (https://namgyujisu.github.io, 로컬 확인용 http://localhost:8000) 을 등록.
     · 네이버 키: https://console.ncloud.com → Maps → Application 등록 →
       "Web Dynamic Map" 사용 설정 후 발급되는 Client ID(인증 키).
       마찬가지로 서비스 URL 에 위 도메인들을 등록해야 지도가 뜹니다.
     ------------------------------------------------------------- */
  map: {
    // 'image'  — 예식장 약도 이미지 (키 불필요, 제일 가볍고 깔끔함)
    provider: 'image',
    image: 'images/venue-map.png',

    kakaoAppKey: '259eb8c9d3544cad0d35b041bd1176dd',  // 카카오 JavaScript 키
    naverClientId: '',  // TODO: 네이버 Client ID (인증 키)
    zoom: 16,           // 네이버 · 구글 확대 단계 (클수록 확대)
    kakaoLevel: 4,      // 카카오 확대 단계 (작을수록 확대)
  },

  /* ---------- 인사말 ---------- */
  greeting: {
    poem: [
      '서로가 마주 보며 다져온 사랑을',
      '이제 함께 한곳을 바라보며',
      '걸어갈 수 있도록 지켜봐 주세요.',
    ],
    body: [
      '두 사람이 사랑으로 만나',
      '진실과 이해로써 하나가 되려 합니다.',
      '',
      '저희 두 사람의 새로운 시작을',
      '따뜻한 마음으로 축복해 주시면',
      '더없는 기쁨으로 간직하겠습니다.',
    ],
  },

  /* ---------- 갤러리 ---------- */
  // images/ 폴더에 사진을 넣고 파일명을 적어주세요.
  gallery: [
    'images/gallery-01.svg',
    'images/gallery-02.svg',
    'images/gallery-03.svg',
    'images/gallery-04.svg',
    'images/gallery-05.svg',
    'images/gallery-06.svg',
    'images/gallery-07.svg',
    'images/gallery-08.svg',
    'images/gallery-09.svg',
  ],

  /* ---------- 마음 전하실 곳 ---------- */
  accounts: {
    groom: {
      label: '신랑측',
      list: [
        { relation: '신랑', name: '박남규', bank: '○○은행', number: '000-0000-0000-00' }, // TODO
        { relation: '아버지', name: '박○○', bank: '○○은행', number: '000-0000-0000-00' }, // TODO
        { relation: '어머니', name: '○○○', bank: '○○은행', number: '000-0000-0000-00' }, // TODO
      ],
    },
    bride: {
      label: '신부측',
      list: [
        { relation: '신부', name: '염지수', bank: '○○은행', number: '000-0000-0000-00' }, // TODO
        { relation: '아버지', name: '염○○', bank: '○○은행', number: '000-0000-0000-00' }, // TODO
        { relation: '어머니', name: '○○○', bank: '○○은행', number: '000-0000-0000-00' }, // TODO
      ],
    },
  },

  /* ---------- 공유 ---------- */
  /* ---------- 방명록 (Firebase Firestore) ---------- */
  // Firebase 콘솔 → 프로젝트 설정 → 내 앱 → 웹 앱의 firebaseConfig 를 붙여넣으세요.
  // 이 값들은 비밀키가 아니라 공개용 식별자입니다. 실제 접근 제어는
  // Firestore 보안 규칙이 담당하므로 저장소에 공개되어도 괜찮습니다.
  // 비워두면 방명록 섹션이 "준비 중"으로 표시됩니다.
  firebase: {
    apiKey: 'AIzaSyBNKBrdGxR97VNWCGIprCfy6E0_peYE62s',
    authDomain: 'namgyujisu.firebaseapp.com',
    projectId: 'namgyujisu',
    storageBucket: 'namgyujisu.firebasestorage.app',
    messagingSenderId: '78598430429',
    appId: '1:78598430429:web:9187e3809a133df1650534',
  },

  // 미리보기 카드(og) 문구는 index.html 의 meta 태그에서 관리한다.
  // 스크래퍼는 JS 를 실행하지 않아 여기 값으로는 바꿀 수 없기 때문이다.
  share: {
    title: '박남규 ♥ 염지수 결혼합니다',
    description: '2027년 10월 17일 일요일 오후 1시, 노블발렌티 삼성 5층 채플홀',

    // 카카오톡 공유 카드에 쓰는 값들.
    // image 는 반드시 절대주소여야 하고, 카카오가 직접 받아가므로 공개돼 있어야
    // 합니다. 가로형(1200x630)이 카드에 가장 잘 맞습니다.
    image: 'https://namgyujisu.github.io/images/og-image.jpg',
    url: 'https://namgyujisu.github.io/',
    buttonText: '청첩장 보기',
  },
};

// guestbook.js 는 모듈이라 전역 렉시컬 바인딩 대신 이 참조를 쓴다.
window.CONFIG = CONFIG;
