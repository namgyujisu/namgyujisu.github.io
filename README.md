# 박남규 ♥ 염지수 — 모바일 청첩장

노블발렌티 삼성. 빌드 도구 없이 HTML/CSS/JS 세 파일로만 동작하는 정적 사이트라
GitHub Pages에 그대로 올라갑니다.

## 구조

```
index.html            마크업 (섹션 뼈대만, 내용은 JS가 채움)
css/style.css         전체 스타일
js/config.js          ← 내용은 거의 다 여기서 수정합니다
js/main.js            config 를 읽어 페이지를 그림
images/               사진 (지금은 자리표시 SVG)
scripts/              자리표시 이미지 생성기 (사진 넣으면 불필요)
```

## 수정하는 법

내용 수정은 **`js/config.js` 하나만** 열면 됩니다. `TODO` 주석이 달린 곳이
아직 채워야 할 항목입니다.

| 항목 | 위치 |
| --- | --- |
| 예식 일시 | `CONFIG.date` — `{ year, month, day, hour, minute }`, 월은 1~12 |
| 신랑·신부·부모님 이름/연락처 | `CONFIG.groom`, `CONFIG.bride` |
| 예식장·홀 이름·교통편 | `CONFIG.venue` |
| 인사말 문구 | `CONFIG.greeting` |
| 갤러리 사진 목록 | `CONFIG.gallery` |
| 계좌번호 | `CONFIG.accounts` |

날짜만 바꾸면 상단 히어로 문구, 달력, D-day가 모두 함께 갱신됩니다.

### 사진 교체

`images/` 에 실제 사진을 넣고 `config.js` 의 경로를 바꿔주세요.

- **대표 사진** — 세로(3:4 정도) 사진이 가장 잘 맞습니다. `index.html` 의
  `<img src="images/hero.svg">` 와 `og:image` 두 곳을 함께 바꿔주세요.
- **갤러리** — 정사각형으로 잘려 보입니다. 긴 변 1200px 내외로 줄여 올리면
  모바일에서 빠르게 뜹니다.

### 지도

`js/config.js` 의 `CONFIG.map.provider` 로 지도를 고릅니다 —
`'kakao'` / `'naver'` / `'google'`.

- **구글** — 키가 필요 없습니다. 다른 제공자의 키가 비어 있거나 로딩에
  실패하면 여기로 자동 폴백하므로 지도가 빈 칸으로 남지 않습니다.
- **카카오맵** — [developers.kakao.com](https://developers.kakao.com) 에서
  앱을 만들고 **JavaScript 키**를 `kakaoAppKey` 에 넣은 뒤,
  [앱 설정 → 플랫폼 → Web] 에 사이트 도메인
  (`https://namgyujisu.github.io`, 로컬 확인용 `http://localhost:8000`) 을 등록.
- **네이버 지도** — [console.ncloud.com](https://console.ncloud.com) 에서
  Maps → Application 등록 → *Web Dynamic Map* 을 켜고 발급된 Client ID 를
  `naverClientId` 에 넣고, 서비스 URL 에 위 도메인들을 등록.
  (구 콘솔 키를 쓰면 `js/main.js` 의 `ncpKeyId` 를 `ncpClientId` 로 바꿔야
  합니다.)

도메인을 등록하지 않으면 키가 맞아도 지도가 뜨지 않으니 꼭 함께 해주세요.
아래 네이버/카카오/구글 바로가기 버튼은 키 없이 그대로 동작합니다.

## 로컬에서 보기

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

브라우저 개발자도구의 모바일 뷰(iPhone 등)로 보면 실제와 가장 비슷합니다.

## 배포

`main` 브랜치에 푸시하면 GitHub Pages가 자동으로 갱신합니다.
(Settings → Pages → Source: `main` / `/root`)

## 포함된 것

- 사진 위에 이름·날짜·예식장이 얹힌 풀스크린 히어로
- 스크롤 등장 애니메이션 (`prefers-reduced-motion` 존중)
- 예식일이 표시된 달력 + D-day 카운터
- 갤러리 라이트박스 (스와이프 · 키보드 방향키 지원)
- 전화/문자 바로가기, 지도 앱 3종 바로가기
- 계좌번호 아코디언 + 한 번에 복사
- 공유하기 (모바일 네이티브 공유 시트 / 링크 복사 폴백)
