# 방명록 연결하기 (Firebase)

방명록 코드는 이미 다 들어가 있습니다. **`js/config.js` 의 `firebase` 값만 채우면**
바로 동작합니다. 비어 있는 동안에는 "방명록 준비 중입니다"로 표시됩니다.

## 1. 프로젝트 만들기

1. https://console.firebase.google.com 접속 (구글 계정으로 로그인)
2. **프로젝트 추가** → 이름 아무거나 (예: `wedding`)
3. Google 애널리틱스는 **사용 안 함**으로 두어도 됩니다

## 2. Firestore 데이터베이스 만들기

1. 왼쪽 메뉴 **빌드 → Firestore Database** → **데이터베이스 만들기**
2. 위치는 **asia-northeast3 (서울)**
3. **프로덕션 모드**로 시작 (규칙은 3번에서 넣습니다)

## 3. 보안 규칙 넣기

**규칙** 탭으로 가서 전체를 아래로 바꾸고 **게시**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /guestbook/{entry} {
      allow read: if true;

      allow create: if request.resource.data.keys().hasOnly(
                         ['name', 'message', 'pwHash', 'createdAt'])
                    && request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 20
                    && request.resource.data.message is string
                    && request.resource.data.message.size() > 0
                    && request.resource.data.message.size() <= 500
                    && request.resource.data.pwHash is string
                    && request.resource.data.pwHash.size() == 64;

      allow update: if false;
      allow delete: if true;
    }
  }
}
```

글자 수와 필드를 제한해서 엉뚱한 데이터가 들어오는 걸 막습니다.

## 4. 웹 앱 등록하고 설정값 복사

1. 프로젝트 개요 옆 **⚙ → 프로젝트 설정**
2. 아래 **내 앱** → **웹(`</>`)** 아이콘 클릭
3. 앱 닉네임 아무거나 → **앱 등록**
4. `firebaseConfig` 값이 나옵니다:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "wedding-xxxx.firebaseapp.com",
  projectId: "wedding-xxxx",
  storageBucket: "wedding-xxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

이 값을 `js/config.js` 의 `firebase` 항목에 그대로 옮겨 적고 `git push` 하면 끝입니다.

> **이 값들은 비밀키가 아닙니다.** 웹에 공개되는 게 정상이고, 실제 접근 제어는
> 3번의 보안 규칙이 담당합니다. 저장소에 커밋해도 괜찮습니다.

## 5. (권장) 도메인 제한

프로젝트 설정 → **앱 체크**는 건너뛰어도 되지만,
**Authentication → Settings → 승인된 도메인**에 `namgyujisu.github.io` 만
남겨두면 다른 사이트에서 이 프로젝트를 쓰는 걸 줄일 수 있습니다.

## 6. 참석여부 받기 (Firestore)

**Blaze 전환이 필요 없습니다.** 방명록과 같은 무료 요금제에서 그대로 돌아갑니다.
코드는 이미 들어가 있고(`js/rsvp.js`), **아래 규칙만 게시하면** 동작합니다.
규칙을 넣지 않으면 하객이 눌러도 저장되지 않고 "전달하지 못했습니다"가 뜹니다.

방명록과 달리 **쓰기 전용**입니다. 누가 오는지, 몇 명 오는지는 다른 하객에게
보일 정보가 아니라 `read` 를 막아두었습니다. 집계는 콘솔이나 6-2 의 스크립트로
꺼냅니다. 읽지 않으니 요금이 나갈 일도 없습니다.

### 6-1. 보안 규칙

**Firestore Database → 규칙** 탭 전체를 아래로 바꾸고 **게시**하세요.
3장의 방명록 규칙까지 함께 들어 있으므로, **통째로 붙여넣으면 됩니다.**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /guestbook/{entry} {
      allow read: if true;

      allow create: if request.resource.data.keys().hasOnly(
                         ['name', 'message', 'pwHash', 'createdAt'])
                    && request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 20
                    && request.resource.data.message is string
                    && request.resource.data.message.size() > 0
                    && request.resource.data.message.size() <= 500
                    && request.resource.data.pwHash is string
                    && request.resource.data.pwHash.size() == 64;

      allow update: if false;
      allow delete: if true;
    }

    match /rsvp/{entry} {
      // 하객은 남길 수만 있다. 목록을 읽는 건 콘솔과 서비스 계정만 가능하다.
      allow read, update, delete: if false;

      allow create: if request.resource.data.keys().hasOnly(
                         ['side', 'name', 'companions', 'attending', 'count',
                          'meal', 'phone', 'note', 'createdAt'])
                    && request.resource.data.side in ['groom', 'bride']
                    && request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 20
                    && request.resource.data.companions is string
                    && request.resource.data.companions.size() <= 200
                    && request.resource.data.attending is bool
                    && request.resource.data.count is int
                    && request.resource.data.count >= 0
                    && request.resource.data.count <= 20
                    && request.resource.data.meal is string
                    && request.resource.data.meal.size() <= 10
                    && request.resource.data.phone is string
                    && request.resource.data.phone.size() <= 20
                    && request.resource.data.note is string
                    && request.resource.data.note.size() <= 200;
    }
  }
}
```

### 6-2. 참석자 명단 보기

콘솔에서도 볼 수 있습니다: **Firestore Database → 데이터 → `rsvp`**.
사람이 많아지면 한 건씩 세는 게 번거로워서 집계 스크립트를 두었습니다.

이 스크립트는 **서비스 계정 키**가 필요합니다. 규칙에서 읽기를 막아두었으니
관리자 자격으로만 꺼낼 수 있기 때문입니다.

1. ⚙ **프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성** → json 파일 받기
2. 그 json 은 **저장소 밖에 두세요.** 방명록과 참석자 명단을 전부 읽고 지울 수
   있는 진짜 비밀키라, 4번의 `firebaseConfig` 와 성격이 완전히 다릅니다.
3. 실행:

```bash
npm install firebase-admin
GOOGLE_APPLICATION_CREDENTIALS=~/wedding-key.json node scripts/pull-rsvp.js
```

신랑측 · 신부측 인원과 식사 인원을 합쳐서 보여주고, `rsvp.csv` 로도 저장합니다
(엑셀에서 바로 열립니다). 예식장에 식수를 알려줄 때 이 숫자를 쓰시면 됩니다.

### 6-3. 마감일

`js/config.js` 의 `rsvp.deadline` 날짜가 지나면 폼이 사라지고 안내문만 남습니다.
기본값은 예식 한 주 전입니다. 계속 받고 싶으시면 날짜를 미루거나 비워두세요.

## 알아두실 점

- **비밀번호는 해시(SHA-256)로만 저장됩니다.** 원문은 어디에도 남지 않아
  방명록을 읽어도 비밀번호를 알아낼 수 없습니다.
- 다만 `allow delete: if true` 라서, 마음먹은 사람은 API 로 남의 글을 지울 수
  있습니다. 규칙만으로는 비밀번호 대조를 할 수 없기 때문입니다(삭제 요청에는
  본문이 실리지 않음). 참고하신 청첩장 사이트들도 같은 구조입니다.
  주소가 검색에 안 잡히게 막아두었으니 실제 위험은 낮습니다.
- 정말 막으려면 Supabase 의 서버 함수로 옮기면 됩니다. 필요하시면 말씀해 주세요.
- 무료 한도는 하루 읽기 5만 / 쓰기 2만 건이라 청첩장 용도로는 남습니다.
- 글 삭제·관리는 Firebase 콘솔의 Firestore 화면에서 직접 하실 수 있습니다.
