+++
title = "แก้ปัญหา TS5055: Cannot write file because it would overwrite input file"
date = "2025-03-27"

[taxonomies]
categories = [ "TypeScript" ]
tags = [ "TypeScript", "tsconfig", "build", "npm-package", "debugging" ]
+++

ช่วงที่ผมกำลังพัฒนา library ตัวหนึ่งชื่อว่า `kubricate` ซึ่งเป็น framework สำหรับจัดการ Kubernetes manifests ด้วย TypeScript ผมตั้งค่าให้ build แบบ dual output ทั้ง ESM และ CJS โดยใช้ TypeScript compile ไปที่ `dist/esm` และ Babel แปลงเป็น `dist/cjs` ต่อ

ทุกอย่างดูเหมือนจะโอเค จนกระทั่งเปิด `declaration: true` เพื่อให้ generate ไฟล์ `.d.ts` แล้วตั้ง `declarationDir` ไว้ที่ `dist/dts`

## ปัญหาที่เจอ

พอรัน `tsc` ปุ๊บ ก็เจอ error แบบนี้เลย:

> error TS5055: Cannot write file ‘/path/to/project/dist/dts/internal/utils.d.ts’ because it would overwrite input file.

ซึ่งตอนแรกก็งงว่า "นี่เราทำอะไรผิดตรงไหนหรือเปล่า?" เพราะเราไม่ได้แก้ไขไฟล์ใน `dist` โดยตรงเลย ไฟล์ทั้งหมดอยู่ใน `src` ชัด ๆ

พอดูดี ๆ ก็เห็นว่า TypeScript พยายาม compile แล้วจะเขียนไฟล์ `.d.ts` ไปยัง `dist/dts/...` แต่ดันเข้าใจว่าไฟล์พวกนั้นเป็น **ไฟล์ต้นทาง** (input) ด้วย

## แก้ยังไง

ผมลองไล่ดู config หลายจุด และสุดท้ายก็เจอว่า ตัวแปรสำคัญคือ `"exclude"` ใน `tsconfig.json`

พอเช็กไฟล์ดู พบว่า `dist/` ไม่ได้อยู่ใน `"exclude"` ทำให้ TypeScript มองว่าไฟล์เก่าใน `dist` คือ input ของการ compile

### วิธีแก้:

- เพิ่ม `"dist"` เข้าไปใน `exclude` ของ `tsconfig.json`

```json
{
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist/esm",
    "declarationDir": "dist/dts",
    "declaration": true
  },
  "exclude": ["node_modules", "dist", "*.config.ts"]
}

ลบโฟลเดอร์ dist/ ให้สะอาดก่อนรัน tsc ใหม่:

```sh
rm -rf dist
tsc
```

สรุป

ถ้าใครเจอ Error แบบ `TS5055: Cannot write file ... because it would overwrite input file.` ให้เช็กสองอย่างหลัก ๆ คือ:
- มีการตั้งค่า outDir หรือ declarationDir ซ้อนกับ path ที่เคยมี output ไว้หรือเปล่า
- ลืมใส่ "dist" ไว้ใน exclude หรือเปล่า

แค่นั้นเลยครับ เพิ่ม dist เข้าไปใน exclude แล้วลบของเก่าออกก่อน build ทุกครั้ง ก็จบเลย
