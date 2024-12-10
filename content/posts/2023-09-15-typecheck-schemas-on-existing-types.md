+++
title = "วิธีตรวจสอบให้ Zod schemas ตรงกับ Type ที่ประกาศไว้อยู่แล้ว"
date = "2023-09-15"

[taxonomies]
categories = [ "TypeScript" ]
tags = [ "TypeScript", "Data Validation", "Zod" ]

[extra]
id = "e6btvc1"
+++

วันนี้เราจะมาพูดถึงวิธีการในการตรวจสอบความเข้ากันได้ระหว่าง [Zod](https://github.com/colinhacks/zod) Schema และ TypeScript อย่างสะดวกและรวดเร็ว ไอเดียดีๆ นี้มาจาก [@colinhacks](https://github.com/colinhacks) ซึ่งเป็นคนสร้าง Zod โดยการใช้ Zod และอยากแบ่งปันให้ทุกคน

โดยปกติแล้ว เราบ่งบอกประเภทของข้อมูลด้วย TypeScript เพื่อให้รู้ว่าข้อมูลที่เราใช้เป็นแบบไหน แต่ถ้าเราใช้ Zod Schema เพื่อทำการตรวจสอบข้อมูล มีวิธีหนึ่งที่จะทำให้เราสามารถตรวจสอบความเข้ากันได้ระหว่าง Zod Schema และ TypeScript ได้อย่างมีประสิทธิภาพ และเรียบง่าย นั่นคือการใช้ฟังก์ชัน `schemaForType` ตามตัวอย่างด้านล่าง: 

```typescript
import { z } from 'zod';

type Dog = {
    name: string
    neutered: boolean
}


function schemaForType<TSchema>() {
    return <TZodSchema extends z.ZodType<TSchema, any, any>>(arg: TZodSchema) => arg;
}

// ใช้งานได้ประมาณนี้:
const dog = schemaForType<Dog>()(
    z.object({
        // name: z.string(),  
        neutered: z.boolean(),
    })
    // ❌ Property 'name' is missing in type 
    // '{ neutered: boolean; }' but required in type 'Dog'
);
```

การทำงานของฟังก์ชันซ้อนกันนี้อาจดูแปลก ๆ แต่มันเป็นจำเป็น เพราะมีระดับการใช้ Generic สองระดับ

1. TypeScript ที่ต้องการ `TSchema` 
2. Schema ที่สร้างขึ้นอย่างอัตโนมัติ `TZodSchema` ซึ่งถูก จำกัดโดย `extends z.ZodType<TSchema, any, any>`
    
อย่างไรก็ตาม คุณไม่ต้องกังวลเกี่ยวกับ `any` ที่เหลือสองตัวนั้น เนื่องจากเรากำลังใช้ `TSchema` เป็น Type hint โดยตรง นั่นหมายความว่าเราต้องใช้ฟังก์ชันเพิ่มเติมที่ให้เราสามารถตรวจสอบประเภทของ `TZodSchema` ได้ ซึ่งนี้เป็นเพราะ TypeScript จำเป็นต้องระบุพารามิเตอร์ Generic ทั้งหมดโดยชัดเจนหรือให้มันถูก Infer ทั้งหมด ไม่สามารถเลือกหรือผสมผสานได้ แม้ว่ามีข้อเสนอรองเรื่องนี้อยู่ [microsoft/TypeScript#26242](https://github.com/microsoft/TypeScript/issues/26242) ในเดียวนี้

ดังนั้น เราสามารตรวจสอบให้ Zod schemas ตรงกับ Type ที่ประกาศไว้อยู่แล้ว คุณสามารถใช้ฟังก์ชัน `schemaForType` เพื่อรักษาความ Consistency ในโปรเจคของคุณอีกด้วย! ขอบคุณที่ติดตามบทความนี้ครับและขอให้สนุกกับการเขียนโปรแกรมนะจ๊ะ

## Ref
- [colinhacks/zod Issuse#372](https://github.com/colinhacks/zod/issues/372#issuecomment-826380330)
-  ใช้ ChatGPT ช่วยเรียบเรียงด้วย