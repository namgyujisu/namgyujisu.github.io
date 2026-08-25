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
    lat: 37.5136,
    lng: 127.0596,
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
  share: {
    title: '박남규 ♥ 염지수 결혼합니다',
    description: '노블발렌티 삼성에서 저희의 시작을 함께해 주세요.',
    image: 'images/hero.svg', // TODO: 실제 대표 사진 (og:image)
  },
};
