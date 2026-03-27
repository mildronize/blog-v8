+++
title = "ทำ Template แรกของ Elysia: Type-Safe ตั้งแต่ Database ถึง Frontend"
description = "แชร์ประสบการณ์ทำ full-stack template ด้วย Elysia, Prisma v7, Eden Treaty และ React หลังจากได้คุยกับออมที่งาน BKK.JS 24"
date = "2026-03-27"

[taxonomies]
tags = [ "elysia", "prisma", "typescript", "react", "bun" ]
categories = [ "Web Development" ]

[extra]
id = "m4lk6op"
+++


ตอนที่ไปงาน BKK.JS 24 มีโอกาสได้พูดคุยกับออม แล้วก็ถามข้อสงสัยเกี่ยวกับ Elysia หลายอย่างเลยครับ ทำให้เข้าใจความตั้งใจในการออกแบบของออมมากขึ้น ทั้งเรื่องการออกแบบ Framework, การเขียน TypeScript, รวมถึงการ Optimize ต่างๆ

ก่อนหน้านี้ผมมี [Template ที่ใช้อยู่เป็น Next.js + tRPC + MongoDB](https://github.com/thaitype/thaitype-stack-mongodb-template) ซึ่งใช้งานได้ดีครับ แต่พอได้คุยกับออมแล้วเลยคิดว่าน่าจะลองทำ Template อีกตัวที่ใช้ Elysia ดูบ้าง โดยเฉพาะให้มัน AI Friendly ด้วย เพราะตอนนี้ผมใช้ Claude Code กับ [Chief Agent Framework](https://github.com/thaitype/chief-agent-framework) ในการเขียนโค้ดเป็นหลักอยู่แล้ว

จุดที่ทำให้ตัดสินใจเลยก็คือตอนที่ออม Demo ให้ดูว่าเราสามารถ infer Type จาก Prisma ได้โดยตรง ทำ Type-Safety ตั้งแต่ระดับ Database จนถึง Frontend เลยทีเดียวครับ

## Type-Safety Chain

flow ของ type ใน template ตัวนี้จะเป็นแบบนี้ครับ

```text
prisma/schema.prisma (single source of truth)
  -> Prisma Client     (TypeScript types)
  -> Prismabox         (TypeBox schemas สำหรับ Elysia validation)
  -> Elysia routes     (body/response validation)
  -> Eden Treaty       (type-safe RPC ฝั่ง frontend)
  -> React Query hooks (typed data fetching)
```

ก็คือ define ที่ Prisma schema ที่เดียว แล้ว type มันก็ไหลไปทั้ง stack เลยครับ ไม่ต้องมานั่งเขียน interface ซ้ำกันทุกชั้น

ตัวอย่างเช่น ใน `schema.prisma` เรา define Todo model ไว้แค่ที่เดียว แล้วพอรัน `prisma generate` มันจะ generate ทั้ง Prisma Client types และ TypeBox schemas ผ่าน Prismabox ให้เลย

```prisma
generator prismabox {
  provider                    = "prismabox"
  typeboxImportDependencyName = "elysia"
  typeboxImportVariableName   = "t"
  inputModel                  = true
  output                      = "../generated/prismabox"
}
```

พอมาฝั่ง route ก็ไม่ต้องเขียน `t.Object({...})` เองครับ import จาก prismabox แล้วใช้ `t.Pick` เอา field ที่ต้องการได้เลย

```typescript
import { TodoPlain, TodoPlainInputCreate } from '#generated/prismabox/Todo'

const CreateTodoBody = t.Pick(TodoPlainInputCreate, ['title', 'description'])

.post('/', ({ user, body }) => container.todoService.create(user.id, body), {
  withAuth: true,
  body: CreateTodoBody,
  response: TodoPlain,
})
```

ฝั่ง frontend ก็ไม่ต้อง declare Todo type เองเลย ใช้ Eden infer type ให้ได้เลยครับ

```typescript
type GetTodosResponse = Treaty.Data<ReturnType<typeof api.api.todos.get>>
export type Todo = GetTodosResponse extends (infer T)[] ? T : never
```

## จุดที่ว้าว: Macro กับ Plugin ของ Elysia

จุดที่ว้าวมากๆ ก็คือการที่ออมออกแบบให้มี Escape Hatch สำหรับ Type-Safety ที่ยืดหยุ่นมากครับ

ปัญหาที่เจอใน template ตัวนี้คือผมใช้ Better Auth ซึ่งมัน mount handler แบบ `.mount(auth.handler)` ทำให้ type ที่ return ออกมาจากฝั่ง server เป็น union type แบบ `PayloadType | Response` ก็คือ payload ที่เราอยากได้จะ union กับ Response ของ Better Auth ที่ทำพวก `/api/auth/*` ต่างๆ

ปกติถ้าเจอแบบนี้ก็ต้องมาทำ type cast ใช้ `as` หรือเขียน type guard วุ่นวายครับ

แต่ Elysia มี Macro ที่ทำให้เรา confirm type จากฝั่ง server ได้เลย แถมสามารถ inject type ลงไปแต่ละ route ได้อีก ผมเลยทำเป็น auth plugin แบบนี้ครับ

```typescript
export const authPlugin = new Elysia({ name: 'auth' })
  .mount(auth.handler)
  .macro({
    withAuth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({ headers })
        if (!session) return status(401)
        return { user: session.user }
      },
    },
  })
```

พอเอาไปใช้ใน route ก็แค่ใส่ `{ withAuth: true }` แล้ว `user` ก็จะอยู่ใน context ให้เลย type safe ทั้งหมด ไม่ต้อง cast อะไรเลยครับ

```typescript
.get('/', ({ user }) => container.todoService.getAll(user.id), {
  withAuth: true,
  response: t.Array(TodoPlain),
})
```

แบบนี้ route handler return แค่ `Todo[]` ไม่มี `Response` มา union ให้วุ่นวาย Eden ฝั่ง frontend ก็เห็น type ถูกต้องไปด้วยเลยครับ

## Stack ทั้งหมด

**Backend & API**

- Elysia -- Type-safe web framework on Bun runtime
- Prisma v7 -- ORM with SQLite (libsql adapter สำหรับ Bun)
- Better Auth -- Authentication library
- Prismabox -- Auto-generate TypeBox schemas จาก Prisma
- Pino -- Structured logging

**Frontend & UI**

- React 19 -- UI library with Vite bundler
- TanStack Router -- File-based routing
- Eden Treaty -- Type-safe RPC client สำหรับ Elysia
- React Query -- Data fetching and cache management
- shadcn/ui -- Component library on Radix + Tailwind CSS v4

ตัว template เป็น SPA ครับ ใช้ TanStack Router อยู่ ใครอยากจะย้ายไปใช้ TanStack Start หรือ React Router ก็ได้ตามถนัดเลย

## ลองเล่นกันได้

```bash
git clone https://github.com/thaitype/thaitype-stack-spa-react-elysia-prisma-template.git
cd thaitype-stack-spa-react-elysia-prisma-template
bun install
cp .env.example .env
bun run db:push
bun run dev
```

เปิด http://localhost:3000 สมัครสมาชิก แล้วลองเพิ่ม Todo ดูได้เลยครับ

ก็ถือว่าเป็น Template แรกที่ทำกับ Elysia ครับ อาจจะยังไม่ชำนาญมาก ฝากชี้แนะด้วยนะครับ เดี๋ยวผมเอาไปใช้จริงแล้วจะกลับมาทยอยอัพเดทเรื่อยๆ

GitHub: [thaitype-stack-spa-react-elysia-prisma-template](https://github.com/thaitype/thaitype-stack-spa-react-elysia-prisma-template)

สวัสดีครับ
