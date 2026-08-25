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
