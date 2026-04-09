# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

찐막 속마음 번역기 — 친구 이름을 입력하면 랜덤 "속마음" 문구를 슬롯머신 연출과 함께 보여주는 풀스택 웹앱. 랭킹 시스템으로 이름별 플레이 횟수를 추적한다.

## Tech Stack

- **Frontend**: React (CRA) + React Router (`client/`)
- **Backend**: Express + better-sqlite3 (`server/`)
- **DB**: SQLite (`server/db/jjinmak.db`, gitignored)

## Development Commands

```bash
# 프론트엔드 개발 서버 (포트 3000, API → localhost:5000 프록시)
cd client && npm start

# 백엔드 개발 서버 (포트 5000, --watch 자동 재시작)
cd server && npm run dev

# 프론트엔드 빌드
cd client && npm run build
```

개발 시 client와 server를 각각 별도 터미널에서 동시 실행한다.

## Architecture

- `client/src/pages/MainPage.js` — 이름 입력, 랭킹 목록 (검색/페이지네이션)
- `client/src/pages/ResultPage.js` — 슬롯머신 애니메이션, 결과 표시, 공유
- `server/index.js` — Express 서버, API 엔드포인트, DB 초기화
- API: `POST /api/translate` (번역 실행), `GET /api/ranking` (랭킹 조회)
- 프로덕션에서는 Express가 React 빌드 결과물을 정적 서빙

## Documentation

- `docs/기획서.md` — 제품 기획 (Notion 원본에서 가져옴)
- `docs/기술스택.md` — 기술 스택 정리

## Language

사용자 대면 콘텐츠와 문서는 한국어로 작성한다.
