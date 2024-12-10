+++
title = "วิธีสร้าง generic function สำหรับเครื่องมือ data validation ที่เป็นหลากหลายได้ใน typescript"
date = "2023-09-12"

[taxonomies]
categories = [ "TypeScript" ]
tags = [ "TypeScript", "Data Validation", "Zod" ]

[extra]
uuid = "z8daujr"
+++

วันนี้เราจะมาเรียนรู้วิธีการสร้างฟังก์ชั่นทั่วไปสำหรับเครื่องมือตรวจสอบข้อมูลใน TypeScript กันครับ! 

ในรหัสนี้เราได้สร้างฟังก์ชั่นและประเภทข้อมูลที่ชื่อ `AcceptedParser` ขึ้นมาก่อน ซึ่งสามารถรับข้อมูลชนิด `T` และมีสองรูปแบบที่ยอมรับคือ:

ฟังก์ชั่นที่รับ `input` และคืนค่าข้อมูลประเภท `T` จากข้อมูลที่รับเข้ามา.
อ็อบเจ็กต์ที่มีเมธอด `parse` ที่รับ `input` และคืนค่าข้อมูลประเภท T จากข้อมูลที่รับเข้ามา. 

> ขอบคุณ AcceptedParser จาก [untypeable](https://github.com/total-typescript/untypeable/blob/main/src/types.ts)

```typescript
export type AcceptedParser<T> =
  | ((input: unknown) => T)
  | {
      parse: (input: unknown) => T;
    };
```
หลังจากนั้นเราได้สร้างคลาส `Entity` ซึ่งใช้สำหรับการจัดการข้อมูลของเรา 

```typescript
export class Entity<TSchema> {
  constructor(public schema?: AcceptedParser<TSchema> | undefined) {}

  parse(data: unknown): TSchema | undefined {
    if (this.schema && 'parse' in this.schema) {
      return this.schema.parse(data);
    }
    if (this.schema) {
      return this.schema(data);
    }
    return data as TSchema;
  }
}
```

คลาสนี้ยังรับ `schema` ที่เป็น `AcceptedParser` ใน constructor ของมันด้วย และมีเมธอด `parse` ที่รับข้อมูล `data` และตรวจสอบ `schema` ว่ามี parse หรือไม่ ถ้ามีเราใช้ `parse` จาก `schema` นี้เพื่อแปลงข้อมูล `data` และคืนค่าออกมา ถ้าไม่มีเราใช้ `schema` โดยตรงเพื่อแปลงข้อมูล data และคืนค่าออกมา.

```typescript
export type InferEntity<T> = T extends Entity<infer U> ? U : never;
```

นอกจากนี้เรายังสร้าง `InferEntity` ซึ่งเป็นประเภทที่ใช้สำหรับการดึงประเภทข้อมูลจาก `Entity` โดยอัตโนมัติ แต่ถ้าไม่ใช่ `Entity` ก็จะคืนค่า never.

ต่อมาเรามาดูตัวอย่างการใช้งาน:

```typescript
// Consumer

import z from 'zod';

const user = new Entity(
  z.object({
    name: z.string(),
    email: z.string().email(),
  })
);

export type UserEntity = InferEntity<typeof user>;

const data = user.parse({
  name: 'John',
  email: '',
});
// Type will be
// const data: {
//     name: string;
//     email: string;
// } | undefined
```

ในตัวอย่างนี้เราสร้าง `Entity` ของผู้ใช้ (`UserEntity`) โดยใช้ Zod เป็น `schema` ที่กำหนดข้อมูลของผู้ใช้ และเราใช้ `parse` เพื่อแปลงข้อมูลที่เราส่งเข้ามาใน `data` กับ `schema` ของเรา ในที่นี้เราจะได้ผลลัพธ์ที่เป็น `UserEntity` หรือ `never` ถ้าไม่สามารถแปลงข้อมูลได้.

หรือเราสามารถประกาศแค่ Generic ก็ได้โดยไม่ต้องใช้ Zod

```typescript
const user = new Entity<{ name: string }>();

const data = user.parse({
  name: 'John',
});

// Type will be
// const data: {
//     name: string;
// } | undefined
```

หวังว่าบทความนี้จะช่วยให้คุณเข้าใจการสร้างฟังก์ชั่นทั่วไปสำหรับเครื่องมือตรวจสอบข้อมูลใน TypeScript ได้เพิ่มเติมครับ!

[playground](https://www.typescriptlang.org/play?noImplicitReturns=false#code/PTAEBkEsCMChZKAFgFxQBwM4C4QHNIUkBXaAOgGMB7AW2BSpQEMAbAWhQE90BTTCgE6R0KYMQB2XXk2gsewWVWjAaTSOOCYBFetz5kUmeDwAe6KgJSgpPUAEEKFHiJ4ATAApMBmHgIA8ACoAfKAAvLCgoAA+oAAUseroxCjYoBIA1uJUAO7iAJRhIQF5EdGgAN6lkZHoXj6pCeJJKWnimTn5haABANxVoAC+fbCm5pagFCxMmJigAKKShJyBAMoUSDyqIZWR1OKYKALEFAwCsUmykBSg-BuqAPypDk4uHnW+q+ubTCExEq48ABm6jcBXKA3gNXesVcTGYqQyWVyeVSATWdyYZX+QJBrgq-UggLiREgmDIt2+oAAZFTQAByWreHh00DqaxIUnkr6qMH9SICHgoYgCcTszkU1RkRk+GFwph5PrVQYEomxElkiXy-FK-mC4Wi9VcjGy5gK-oQpUCoUi0Cw5igabddHfRXKiEjMwWKw2UAASXEgN8CxQS0CIVC3VAphQPHErlmwdD6kDAlAAFUQvd06BUuIeAA3XzDBBgADCVH2xBovngkBoYysAC9QICBLR6Y2qK46cM9gc0j5UxG89l5osuLFSo2yEoAFY8E6xHbVcRMaupacHITiPCxPIAGn630gLA35MO6l3eTIx5Ye8PkQGJTNHob1j06cHia4YT9AaD47LDYVBEsQg5BL2Fb9namIRmBvhStCy6ruu9IAFJUEg4h0g+UaqCeqR0jhsBPn0iABB+2QniwoDQDwJYTFBVgwaklSIEqKE8KkW6XmRYBKre3EXjufGDFicY4nmrhAA)


## อ่านเพิ่ม

ลองดูตัวอย่างการรับ Data Validation หลายๆ เจ้าดูนะ โดยไม่ผูกติด

- [TypeSchema](https://github.com/decs/typeschema) -- Universal adapter for schema validation
- [tRPC](https://trpc.io/)'s [input & output validators](https://trpc.io/docs/server/validators) 
- [untypeable](https://github.com/total-typescript/untypeable/blob/main/src/types.ts)
