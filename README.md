# NestJS Backend API — Blog / Content Platform

> Final Project 2026 · Object-Oriented Programming with TypeScript

---

## Project Overview

ระบบ REST API สำหรับ Blog / Content Platform สร้างด้วย NestJS และ TypeScript โดยใช้หลักการ Object-Oriented Programming (OOP) ประกอบด้วย 3 โมดูลหลัก ได้แก่ **Users**, **Posts**, และ **Comments** รองรับการทำ CRUD ครบถ้วน พร้อม cascade delete และการตรวจสอบความถูกต้องของข้อมูล (validation) ในทุก endpoint

ข้อมูลทั้งหมดถูกเก็บในรูปแบบ JSON file บนเครื่อง (file-based persistence) โดยไม่ใช้ฐานข้อมูลภายนอก

---

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Node.js | ≥ 18.x |
| Language | TypeScript | ^5.1.3 |
| Framework | NestJS | ^10.0.0 |
| API Docs | Swagger (`@nestjs/swagger`) | ^7.1.0 |
| Validation | class-validator / class-transformer | ^0.14.0 / ^0.5.1 |
| Testing | Jest + Supertest | ^29.5.0 |
| Linter | ESLint + TypeScript ESLint | ^8.42.0 |
| Build Tool | NestJS CLI | ^10.0.0 |

---

## วิธีการติดตั้งและรันโปรเจค

### ความต้องการเบื้องต้น (Prerequisites)

- **Node.js** v18 ขึ้นไป
- **npm** v9 ขึ้นไป

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. รันโปรเจค

**Development mode** (auto-reload เมื่อมีการแก้ไขไฟล์)
```bash
npm run start:dev
```

**Production mode**
```bash
npm run build
npm run start:prod
```

**Standard mode**
```bash
npm run start
```

### 3. เปิดใช้งาน

| Service | URL |
|---------|-----|
| API Base URL | `http://localhost:3000` |
| Swagger UI | `http://localhost:3000/api` |

### 4. รัน Tests

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## โครงสร้างโปรเจค

```
oop-typescript-final-project-2026-main/
├── src/
│   ├── common/
│   │   ├── enums/
│   │   │   ├── post-status.enum.ts     # DRAFT | PUBLISHED
│   │   │   └── user-role.enum.ts       # USER | ADMIN
│   │   └── interfaces/
│   │       └── api-response.interface.ts
│   ├── modules/
│   │   ├── users/
│   │   │   ├── dto/
│   │   │   │   └── user.dto.ts         # CreateUserDto, UpdateUserDto
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts      # UserEntity
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── posts/
│   │   │   ├── dto/
│   │   │   │   └── post.dto.ts         # CreatePostDto, UpdatePostDto
│   │   │   ├── entities/
│   │   │   │   └── post.entity.ts      # PostEntity
│   │   │   ├── posts.controller.ts
│   │   │   ├── posts.service.ts
│   │   │   └── posts.module.ts
│   │   └── comments/
│   │       ├── dto/
│   │       │   └── comment.dto.ts      # CreateCommentDto, UpdateCommentDto
│   │       ├── entities/
│   │       │   └── comment.entity.ts   # CommentEntity
│   │       ├── comments.controller.ts
│   │       ├── comments.service.ts
│   │       └── comments.module.ts
│   ├── app.module.ts
│   └── main.ts
├── data/                               # JSON persistence files (auto-generated)
│   ├── users.json
│   ├── posts.json
│   └── comments.json
├── docs/
│   ├── api-specification.md
│   ├── data-model.md
│   └── uml-diagram.mermaid
├── test/
├── package.json
├── tsconfig.json
└── README.md
```

---

## เอกสารประกอบโปรเจค (Documentation)

| เอกสาร | คำอธิบาย |
|--------|----------|
| [API Specification](docs/api-specification.md) | รายละเอียด endpoint ทั้งหมด พร้อม request/response format |
| [Data Model](docs/data-model.md) | โครงสร้าง entity, field definitions, และ relationships |
| [UML Diagram](docs/uml-diagram.mermaid) | Class diagram แสดง entities, services, และ controllers |

---

## Contributors

| Full Name | Username | Student ID |
|-----------|----------|------------|
| ปาน์ณบดี พานิชกิจ | Panabordee | 68010697 |
| ปุณณวิช กำธร | Le0pardd | 68010713 |
| วริทธิ์นันท์ ใบบัว | Sa1i3rii | 68011000 |
| วิภูสรรพ์ จุ่นพิจารณ์ | drunkyeti33 | 68011031 |
