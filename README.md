# Cloudflare 교육용 AI 챗봇

## 배포 (Pages + Functions)
1. Cloudflare Dashboard > Workers & Pages > Create > Pages에서 이 폴더를 Git 저장소로 연결하여 배포합니다. `index.html`은 루트에, `functions/api/chat.js`는 그대로 둡니다. 빌드 명령은 비워두고 출력 디렉터리는 `.`로 설정합니다.
2. Pages 프로젝트 Settings > Bindings에서 Workers AI 바인딩을 추가하고 변수명을 `AI`로 설정합니다. 바인딩 후 재배포합니다.
3. (선택) Cloudflare D1 데이터베이스를 생성한 후 `schema.sql`을 실행하고 Pages의 D1 바인딩 변수명을 `DB`로 설정하여 재배포합니다. D1이 없으면 채팅은 작동하지만 질문은 저장되지 않습니다.
4. 생성된 `*.pages.dev` 주소를 학생에게 공유합니다.

## 주의
- 실제 수업 공개 전 Cloudflare WAF/Rate Limiting, Turnstile, 예산 알림 등을 적용하세요. 무료 할당량과 모델 지원 여부는 계정별로 확인해야 합니다.
- 현재 예제에는 교사용 관리자 화면이나 로그인 기능이 없습니다. D1에 저장된 질문은 Cloudflare 대시보드에서 확인할 수 있습니다.
- 학생들에게 민감한 개인정보를 입력하지 않도록 안내하고 보관 기간 및 삭제 정책을 마련하세요.
- `trycloudflare.com` 임시 주소가 아니라 `pages.dev` 배포를 권장합니다.
