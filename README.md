# Cloudflare Workers AI 학습 챗봇 (fixed-v2)

## GitHub 업로드
`public/`, `src/`, `wrangler.jsonc`, `schema.sql`을 저장소 루트에 업로드합니다.
이전 Pages Functions용 `functions/` 폴더 및 루트의 `index.html`은 제거합니다.
Cloudflare Workers GitHub 배포 명령은 `npx wrangler deploy`입니다.

## 필수 바인딩
`wrangler.jsonc`에 Workers AI 바인딩 `AI`가 정의되어 있습니다. 배포 후 `/api/health`를 열어 `aiBound: true`인지 확인하세요.

## 선택 사항: D1 저장
Cloudflare D1 데이터베이스를 생성하고 D1 Console에서 `schema.sql`을 실행합니다.
Worker 프로젝트 설정에서 변수 이름 `DB`로 D1 바인딩을 추가합니다. 또는 `wrangler.jsonc`에 아래를 추가합니다(실제 database_id로 교체):

```json
"d1_databases": [{ "binding": "DB", "database_name": "chatbot-db", "database_id": "실제-D1-데이터베이스-ID" }]
```

D1 미연결 상태에서도 AI 채팅은 작동하며 저장은 생략됩니다.

## 확인
- `/api/health` 에서 버전 `2026-11-10-fixed-v2` 확인
- 챗봇 페이지에서 QAOA 질문 입력
- API 테스트: `curl -X POST https://chatbot3.bumpkinr.workers.dev/api/chat -H "Content-Type: application/json" -d '{"message":"QAOA란?","nickname":"학생1"}'`

주의: 공개 서비스 전에는 Cloudflare WAF/Rate Limiting, 접근 제어, 개인정보 보존 정책 등을 추가하세요. 현재 버전은 관리자 조회 API를 제공하지 않습니다.
