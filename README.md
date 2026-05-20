# Muu

<p>
  <img src="./public/assets/characters/main.png" alt="Muu main pixel character" width="180" />
</p>

Muu는 오늘의 감정과 행동 패턴을 바탕으로 인간 유형과 상태 리포트를 보여주는 태블릿 중심 픽셀 UI 앱입니다. 귀여운 화면을 쓰지만 결과 문구는 현실적이고 약간 직설적인 톤을 유지합니다.

## Features

- 12개 질문 기반 오늘의 인간 상태 체크
- 감정 태그와 자유 입력을 반영한 룰 기반 분석
- 같은 입력이면 항상 같은 결과를 반환하는 deterministic 분석 로직
- OpenAI API 기반 보조 관찰
- localStorage 최근 결과 저장/복원
- `/check-in` 오늘의 인간 상태 체크 플로우
- `/archive` 날짜별 감정 기록 아카이브
  - 저장된 Muu 결과를 날짜별로 묶어 확인
  - 날짜 그리드, 기록 요약, 선택 날짜 상세 표시
- `/decision-lab` 결정 실험실
  - 고민 주제와 선택지 2~4개 비교
  - 현재 인간 유형/감정 태그/자유 입력 context 반영
  - AI 없이도 동작하는 룰 기반 추천

## Character Assets

결과 화면은 `public/assets/characters` 안의 인간 유형별 PNG 에셋을 사용합니다.

| Main | Burnout | Planner | Anxiety |
| --- | --- | --- | --- |
| <img src="./public/assets/characters/main.png" alt="main" width="120" /> | <img src="./public/assets/characters/quietBurnout.png" alt="quiet burnout" width="120" /> | <img src="./public/assets/characters/overheatedPlanner.png" alt="overheated planner" width="120" /> | <img src="./public/assets/characters/futureBuffering.png" alt="future buffering" width="120" /> |

| Dopamine | Emotion | Stable | Overload |
| --- | --- | --- | --- |
| <img src="./public/assets/characters/dopamineScroller.png" alt="dopamine scroller" width="120" /> | <img src="./public/assets/characters/emotionalWave.png" alt="emotional wave" width="120" /> | <img src="./public/assets/characters/unexpectedlyOkay.png" alt="unexpectedly okay" width="120" /> | <img src="./public/assets/characters/softSystemOverload.png" alt="soft system overload" width="120" /> |

## Tech Stack

- Next.js App Router
- TypeScript strict mode
- CSS Modules
- Vitest
- localStorage

## Commands

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## Routes

- `/`: Muu 홈
- `/check-in`: 오늘의 인간 상태 체크 앱
- `/archive`: 날짜별 감정 기록 아카이브
- `/decision-lab`: 결정 실험실
- `decision.*`, `lab.*`: 배포 환경에서 도메인이 연결되면 결정 실험실로 rewrite

## Environment

OpenAI 보조 관찰을 사용하려면 서버 환경 변수에 `OPENAI_API_KEY`를 설정합니다. API 호출은 클라이언트 컴포넌트가 아니라 `src/app/api/ai-observation/route.ts`에서만 수행합니다.
