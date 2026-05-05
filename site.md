# Workspace

## Overview

A movie critics blog site called "The Projection Room" — a full-stack web app where users can post film review articles and comment on them. Built as a student testing project (Postman + Selenium compatible).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/movie-blog)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: express-session + bcrypt (cookie-based sessions)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Features

- **Two user roles**: `poster` (can post articles + comment) and `commenter` (can only comment)
- **User auth**: register, login, logout, session-based with cookies
- **Articles**: list, view, create (poster only), delete (own articles)
- **Comments**: list per article, create (logged in), delete (own comments)
- **Users**: list all

## Demo Accounts

| Username | Password | Role |
|---|---|---|
| filmcritic | poster123 | poster |
| moviefan | commenter123 | commenter |

## Routes (Frontend)

- `/` — Home: list all reviews
- `/article/:id` — Article detail + comments
- `/login` — Login form
- `/register` — Register form (choose role)
- `/new-article` — Create article (poster role only)
- `/my-articles` — My articles list (poster role only)

## API Endpoints (Postman Testing)

Base URL: `/api`

### Auth
- `POST /api/auth/register` — Register `{ username, password, role }`
- `POST /api/auth/login` — Login `{ username, password }`
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Current user (401 if not logged in)

### Articles
- `GET /api/articles` — List articles (query: `limit`, `offset`)
- `POST /api/articles` — Create article (poster role required)
- `GET /api/articles/:id` — Get article
- `DELETE /api/articles/:id` — Delete article (author only)

### Comments
- `GET /api/articles/:id/comments` — List comments
- `POST /api/articles/:id/comments` — Create comment (login required)
- `DELETE /api/comments/:id` — Delete comment (author only)

### Users
- `GET /api/users` — List all users

## data-testid Attributes (Selenium Testing)

All interactive elements have `data-testid` attributes for Selenium:
- Buttons: `button-login`, `button-register`, `button-submit-article`, `button-submit-comment`, `button-logout`, `button-delete-article`
- Inputs: `input-username`, `input-password`, `input-title`, `input-movie-title`, `input-rating`, `textarea-content`, `textarea-comment`
- Lists: `article-list`, `article-card-{id}`, `comment-list`, `comment-item-{id}`
- Nav: `nav-home`, `nav-login`, `nav-register`, `nav-new-article`, `nav-my-articles`, `nav-logout`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
