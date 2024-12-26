+++
title = "จัดการการวน Loop ของ Callback ใน JavaScript"
date = "2024-12-26"

[taxonomies]
categories = [ "JavaScript" ]
tags = [ "JavaScript", "Callback", "Promise", "Async", "TypeScript" ]

[extra]
id = "jwof8mf"
+++


สวัสดีครับ วันนี้เรามาจัดการเรื่องที่น่าปวดหัวของ JavaScript กัน ซึ่งถ้าใครเขียน Promise อยู่บ่อยๆ อยู่แล้ว ก็คงไม่ค่อยเจอกับปัญหาพวกนี้เท่าไหร่แล้วเนอะ แต่ถ้าคนที่เขียน JavaScript ยุคสมัยของ Callback อยู่ ก็คงเจอปัญหานี้บ่อยๆ แล้ว ซึ่งจะต้องเข้าใจการทำงานของ JavaScript Event Loop ก่อน

โดยเจ้า Callback เนี่ยแหละสร้างความปวดหัวในการทำงาน สำหรับคนที่คุ้นเคยกับเขียนแบบ Async/Await มากๆ เลย เพราะมันไม่ได้ทำงานตามลำดับที่เราคิด แต่มันจะเอาไปทำงานหลังบ้าน แล้วก็เสร็จเมื่อไหร่ก็ไม่รู้เลย 555+ น้ำตาจิไหล

{% note(header="Note") %}
ถึงแม้บทความนี้จะเขียนพฤติกรรมของ JavaScript แต่จะใช้ภาษา TypeScript ในการเขียนตัวอย่าง ใครที่อยากจะลองรันตาม
แนะนำใช้ [bun](https://bun.sh/)

```bash
mkdir -p demo-callback && cd demo-callback && bun init -y
```

จากนั้นมันจะสร้างไฟล์ index.ts ให้เรา แล้วเราก็เริ่มเขียนโค้ดตามตัวอย่างได้เลย
โดยให้รันด้วยคำสั่ง `bun run index.ts`
{% end %}

เรามาดูตัวอย่างของจริงกัน อย่างเช่น ปัญหา Classic อย่างเจ้า timeout กันก่อน

```typescript
setTimeout(() => console.log('Timeout 1'), 1000);
console.log('Start');
```

ถ้าเรามองผ่านๆ เราอาจจะคิดว่ามันจะทำตามลำดับ ก็คือเริ่มด้วย `Timeout 1` แต่จริงๆ แล้วมันจะทำงานแบบนี้

```
Start
Timeout 1
```

หมายความว่า มันจะทำงาน `Start` ก่อนแล้วค่อยทำ `Timeout 1` หลังจาก 1 วินาที ซึ่งถ้าเราไม่เข้าใจหลักการของ Event Loop นี้เราจะทำให้เราอ่านโค๊ดแล้วไม่เข้าใจ ถ้าเราต้องการทำงานตามลำดับ ให้ใช้ Promise หรือ Async/Await ก็ได้

```typescript
const timeout = (fn: () => void, ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, ms);
  });
};

console.log('Start');
await timeout(() => console.log('Timeout 1'), 1000);
```

เราก็จัดการแปลงเจ้า `setTimeout` ให้เป็น Promise แล้วเรียกใช้งานด้วย `await` แล้วก็จะทำงานตามลำดับที่เราคิด

## ปัญหาของเวลาที่เราต้องเอา