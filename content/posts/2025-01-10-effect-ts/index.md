+++
title = "Effect: จัดการผลลัพธ์ (Result) ใน TypeScript ครบวงจร ไม่ว่าจะสำเร็จหรือไม่ และ Type-safety อีกด้วย"
date = "2025-01-10"

[taxonomies]
tags = [ "Effect", "TypeScript", "Type-Safety", "Result", "Option" ]
categories = [ "TypeScript" ]

[extra]
id = "8wpo3jn"
+++

> อีกชื่อ "จัดการปัญหาที่ยากที่สุดของ JavaScript และจัดการ Error แบบปลอดภัยและ Type-Safety"

สวัสดีครับ วันนี้เรามาพบกับบทความ [Effect](https://effect.website/) ที่เคยสัญญากับลูกเพจ ThaiType ว่าจะมี Video และผมก็ได้พลัดมาเรื่อยๆ เนื่องจากไม่ค่อยได้จับ TypeScript ในงานเท่าไหร่ จนถึงเวลาที่ต้องเขียนบทความล่ะ 

{% note(header="Note") %}
ก่อนที่เริ่มอ่านบทความนี้ผมคาดหวังว่าทุกคนน่าจะเข้าใจ TypeScript, JavaScript, Promise มากพอ เนื่องจากเป็นเนื้อหาที่ค่อนข้าง Advanced ผมจะค่อยๆ ทยอยเรียบเรียงออกมาให้เข้าใจง่ายที่สุด ถ้าหากสงสัยตรงไหน สามารถเข้ามาพูดคุยหรือ สอบถามได้
{% end %}

ก่อนที่ไปเริ่มอ่านบทความ ผมอยากให้ทุกคนอ่านที่ Disclaimer ก่อน เพื่อให้เข้าใจบริบทของการเล่าเรื่องนี้ เนื่องจาก Effect เป็น Library ที่มีแนวคิดเฉพาะตัว และเกี่ยวข้องอย่างมากับ Functional Programming แต่ไม่จำเป็นต้องเข้าใจแนวคิดพวกนี้มาก่อนก็ได้ครับ

{% warning(header="Disclaimer") %}
ก่อนอื่นผมขอออกตัวก่อนนะครับ ผมเองไม่ได้มาสาย Functional Programming มาก่อน ดังนั้น กลุ่มเป้าหมายของบทความนี้คือกลุ่มคนที่เขียนโปรแกรมทั่วๆ ไปอย่าง Imperative Programming 

ดังนั้นคนที่เขียน Functional มาก่อนไม่ว่าจะเป็นภาษา  [Haskell](https://www.haskell.org/) หรือ [Scala](https://www.scala-lang.org/) หรือภาษาอื่นๆ ก็ตาม หากแนวคิดของ Functional ส่วนไหนผิดพลาดไป สามารถชี้แนะได้เลยนะครับ จะเป็นประโยชน์ต่อผู้อ่านท่านอื่นๆ มากเลยครับ 

สุดท้ายนี้ อย่างที่บอกไปว่าผมไม่ได้เน้นให้คนเขียน Functional อ่าน ดังนั้นผมคาดหวังว่าแค่เขียน TypeScript มาก็น่าจะอ่านเข้าใจได้ง่ายแล้ว และคนสร้าง Effect เอง ก็ต้องการซ่อนความเป็น Functional Programming ออกจาก Effect และเสนอ Programming Paradiagm ที่ใช้เฉพาะกับ Effect เท่านั้น เพื่อให้คนใช้งานสามารถใช้ได้ง่าย

และอาจจะมีหลายๆ คนอาจจะไม่เห็นด้วยความคิดเห็นผม อย่างไรก็ตามผมอยากให้ลองเอา Result Concept ไปลองเขียนดูโดยไม่ใช่ Effect สักระยะ จะเห็นว่า มันไม่ Smooth เหมือนเขียน Rust เท่าไหร่นัก เดี๋ยวผมจะอธิบายความไม่ smooth ต่อๆ ไป ครับ หรือสามารถเข้ามาพูดคุยกันได้ครับ
{% end %}

## 1. ปัญหาของ TypeScript (หรือ JavaScript)

ในภาษา [JavaScript เกิดขึ้นครั้งแรกเพื่อสำหรับการใช้งานบน Browser](https://cybercultural.com/p/1995-the-birth-of-javascript/)  และมันก็ถูกเอามาใช้งานแพร่หลายและหลาย Runtime ไม่ว่าจะเป็นฝั่ง Server-side อย่าง Node.js หรือ [Bun](https://bun.sh/) ในปัจจุบัน 
ซึ่งใน JavaScript เองก็ถูกพัฒนาอย่างต่อเนื่องจนกระทั่ง 10 ปีที่แล้ว ได้มีภาษา TypeScript ที่เติม Type ให้กับ JavaScript

ในส่วนนี้จะอธิบายถึงปัญหาของค่าของ`null` ของ JavaScript หรือ TypeScript เองถูกใช้อย่างแพร่หลายเพราะตัวภาษากำหนดค่าของตัวแปรเอาไว้ แต่ `null` เองก็มีปัญหาหลายๆ อย่าง รวมถึงปัญหาเรื่องการ Infer Type ของ TypeScript เวลา throw Error หรือแม้แต่เรื่องของการเรียก Try/Catch หลายๆ ชั้น หลายๆ คนเรียกว่า Try/Catch Hell 

### 1.1 เมื่อค่าของตัวแปรเป็น null มันอาจจะทำให้ Error โดยเราไม่รู้ตัว
ซึ่งมันอาจจะนำไปสู่ข้อผิดพลาด NullReferenceException ก็ได้ครับ

```ts
function getProductById(id: number): Product | null {
    // Imagine this function may return null if the product is not found
    return id === 101 ? { id: 101, name: "Laptop" } : null;
}

const product = getProductById(202);
console.log(product.name); // This will throw a runtime error: Cannot read property 'name' of null
```

ในตัวอย่างนี้ ฟังก์ชัน `getProductById` จะใช้สำหรับค้นหาสินค้าจากรหัส ID ที่ระบุ หากไม่มีสินค้าตรงกับ ID ที่กำหนด ฟังก์ชันจะคืนค่า `null` ซึ่งถ้าพยายามเข้าถึง `name` ของ `null` จะทำให้เกิดข้อผิดพลาดขณะรันโปรแกรม (runtime error) เนื่องจาก `null` ไม่มี property `name`

{% tip(header="Tip") %}
ปัญหาตรงนี้จะช่วยได้เยอะ ถ้าเราทำตาม Standard ของ TypeScript ก็คือ ตั้งค่าในไฟล์ `tsconfig.json` ว่า [`compilerOptions.strict=true`](https://www.typescriptlang.org/tsconfig/#strict) หรือ [`compilerOptions.strictNullChecks=true`](https://www.typescriptlang.org/tsconfig/#strictNullChecks) ก็ได้ มันจะ Error ที่ Compiler ให้เลย ดังนั้นตรงบรรทัดสุดท้ายมันก็ออกเป็นแบบนี้

```ts
console.log(product?.name);
```
{% end %}

### 1.2 มีตัวแปรมีโอกาสเป็น null ทำให้โค๊ดดูยุ่งเหยิง
เวลาที่มันมีโอกาสเกิด null มันจะต้องทำให้เราต้องตรวจสอบค่าของ null อย่างละเอียดถี่ถ้วน จึงทำให้เกิด if/else มากมาย และทำให้โค๊ดอ่านยาก หรือยิ่งเรามี null ซ้อนลงไปลึกๆ แล้วก็ต้องยิ่งตรวจสอบเยอะ

```ts
function getProductById(id: number): Product | null {
    return id === 101 ? { id: 101, name: "Laptop" } : null;
}

const product = getProductById(202);
if (product !== null) {
    console.log(product.name);
} else {
    console.log('Product not found');
}
```

จากตัวอย่างเราจะเห็นว่าเพียงแค่ต้องการตรวจสอบว่า `product` มีค่าเป็น null หรือไม่เราต้องเพิ่ม if/else เพิ่ม ทำให้มีจำนวนบรรทัดที่ต้องทำความเข้าใจเพิ่ม
 
{% tip(header="Tip") %}
ถ้าเราตั้ง `tsconfig.json` ว่าตาม Tip ข้างบน เราก็สามารถใช้ **Nullish coalescing (`??`)** ได้เหมือนกัน

```ts
console.log(product?.name ?? 'Product not found');
```
{% end %}

จากเหตุผลที่ว่าจากข้อ 1.1 และ 1.2 เราจะเห็นว่า ปัญหาดังกล่าว ถ้าเราใช้งาน TypeScript และ Setup เป็นไปตาม[การตรวจสอบ Type ที่ดีของ Official Document](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html#getting-stricter-checks) และหากเราเป็นผู้ใช้งาน JavaScript หรือกำลัง [Migrate Code จาก JavaScript ไปยัง TypeScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html) นั้น เราจึงไม่สามารถเปิด Option อย่าง `strict=true` ได้ทันทีทันใดได้ ปัญหาหล่าวนี้ก็ยังคงอยู่
### 1.3 ปัญหาความเข้าใจผิด เมื่อเกิด null
ในหลายๆ ครั้ง `null` ถูกนำไปใช้หลายสถานการณ์ เช่น ถ้าเราเขียนฟังก์ชั่น `getProduct` แล้วได้ `null` คำถามคือ `null` แปลว่าไม่มีข้อมูล หรือ มี Error เกิดขึ้นกันแน่
### 1.4 ปัญหาความเข้ากันได้ เมื่อมีโอกาสเกิด null
ในบางครั้งเราเห็นว่าการที่เราเรียกใช้ Library ที่แตกต่างกัน หรือรวมระบบที่แตกต่างกัน จะเห็นว่ามีการอ้างอิงที่ `null` ที่ความหมายแตกต่างกันได้ หรือในบางครั้ง อาจจะใช้ `undefined` มาปะปนกับ `null` ด้วย ทำให้เกิดความเข้าใจกัน ในการสื่อสารได้

จากเหตุผลที่ว่าจากข้อ 1.3 และ 1.4 เราจะเห็นว่า `null` หรือ `undefined` ถูกนำไปใช้ปะปนกัน และอาจจะนำไปสู่ความเข้าใจผิดได้ ซึ่งในรายละเอียด พี่รูฟ ได้เขียน[บทความอธิบายปัญหาของ `null`](https://medium.com/odds-team/%E0%B8%97%E0%B8%B3%E0%B9%84%E0%B8%A1%E0%B9%88-null-%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%AA%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%84%E0%B8%A7%E0%B8%A3%E0%B8%AB%E0%B8%A5%E0%B8%B5%E0%B8%81%E0%B9%80%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%87-typescript-00be4f158df9) ไว้อย่างเข้าใจง่ายแล้ว 

### 1.5 ปัญหา Try/Catch Hell

หลายๆ คนอาจจะเคยได้ยินปัญหา If/Else Hell หรือ Callback Hell กันมาบ้างแล้ว ซึ่งในบทความของคุณ  [Bret Cameron](https://levelup.gitconnected.com/i-fixed-error-handling-in-javascript-4e3c1a28a292) ได้พูดถึงการปัญหาของ Try/Catch hell

### 1.6  No Type in Error when throwing Error


### 1.7 ปัญหา Type เรื่องของ exhaustive check บน Switch Case



## Option/Result/Either
- .....

### References/State of the art

ก่อนหน้านี้หลายๆ คนก็ได้เคยพูดถึงเรื่องของ Option บ้าง Result บ้าง ในบทความต่างๆ ไม่ว่าไทยหรือ English

- พี่รูฟได้เขียนบทความถึง ["ทำไม null เป็นสิ่งที่ควรหลีกเลี่ยง (TypeScript)"](https://medium.com/odds-team/%E0%B8%97%E0%B8%B3%E0%B9%84%E0%B8%A1%E0%B9%88-null-%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%AA%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%84%E0%B8%A7%E0%B8%A3%E0%B8%AB%E0%B8%A5%E0%B8%B5%E0%B8%81%E0%B9%80%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%87-typescript-00be4f158df9) ว่าด้วยเรื่องปัญหาของการมีของ `null` ในภาษา TypeScript และสรุปปัญหาที่เกี่ยวข้องกับ `null` 
	- ภัยเงียบ: เมื่อค่าของตัวแปรเป็น null มักจะนำไปสู่ข้อผิดพลาด
	- .. (สรุป จาก พี่รูฟ)
- โดยคุณ Dan เรื่อง ["Using Results in TypeScript"](https://imhoff.blog/posts/using-results-in-typescript)
- บทความจาก [Bret Cameron](https://bretcameron.medium.com/?source=post_page---byline--4e3c1a28a292--------------------------------) เรื่อง ["I Fixed Error Handling in JavaScript"](https://levelup.gitconnected.com/i-fixed-error-handling-in-javascript-4e3c1a28a292) ที่พูดถึง Concept Result และ Option ...
	- .....
- บทความนี้เมื่อปี 2024 โดยคุณ Dennis เรื่อง ["Creating a Result Type in TypeScript"](https://www.dennisokeeffe.com/blog/2024-07-14-creating-a-result-type-in-typescript)
	- ได้มีการพูดถึง Effect ด้วย

และผมเองได้ก็มีโอกาสศึกษาและพัฒนา Library Option & Result ใช้งานเองที่ชื่อว่า [std-types](https://github.com/thaitype/std-typed) และทำให้เข้าใจว่าทำ Option และ Result ถึงไม่เป็นที่นิยม ทั้งๆ ที่หลายๆ ภาษาที่ไม่ใช่ Functional 

### ตัวอย่าง Library
- [fp-ts](https://github.com/gcanti/fp-ts) (Star: 10.9k) เป็น Functional Programming Library ที่ครบเครื่องที่สุดใน TypeScript ตอนนี้ Library นี้ไปรวมกับ Effect แล้วครับ
- [neverthrow](https://github.com/supermacro/neverthrow) (Star: 4.2k) เป็น Result Library ที่สามารถใช้ได้ทั้งแบบ Sync และ Async และมี utility function สำหรับส่งต่อผลลัพธ์ใน Result Ecosystem เดียวกันด้วย
- [ts-results](https://github.com/vultix/ts-results) (Star: 1.2k) เป็น Result Library เช่นเดียวกัน
- [typescript-result](https://github.com/everweij/typescript-result) (Star: 127) เป็น Result Library เช่นเดียวกัน

## ปัญหาของ Option และ Result

การที่ต้องแปลงระหว่าง 2 โลก ซึ่งมันไม่สะดวก

และปัญหา Classic ของ ซึ่งที่ยังไม่ใช่ Standard คือ
มันยังไม่เป็น Standard ในโลก JavaScript มีการนำไปประยุกต์ใช้งานบางกลุ่ม
และยังไม่เหมาะสำหรับนำไปเขียนใน Library เท่าไหร่นัก

## เปลี่ยนกรอบความคิด โดยการละทิ้ง Promise ไป

Effect.website ทำออกมาเนียบมาก คือ interope ระหว่าง 2 โลกแทบไม่มีเลย

เค้าใช้วิธีคือทิ้ง concept เดิมที่คนใช้อย่างแพร่หลายออกไปทั้งหมดเลย นั่นคือไม่สนใช้ Promise เพราะมัน handle expcected error ยาก แล้วนิยามใหม่ด้วย Object ที่ชื่อว่า Effect ทดแทน การใช้ Promise แบบเดิมทั้งหมดเลย

ซึ่ง Object Effect นั้นก็คล้ายๆ กับ Result ของ Higher Kind Type ใน Fp นั้นแหละ

แต่ก็มีตัว convert ข้ามไปข้ามมาระหว่างสองโลกนะ แต่ lib Result/Option ส่วนใหญ่พอแปลงไปแล้วมัน map ผลลัพธ์ที่ออกมาจาก Result ได้ไมาเยอะ จุดสุดท้าย ยังไงเราก็ต้องถูกบังคับให้ออกมาอยู่โลกของ Promise อยู่

แต่เจ้า Effect ที่ว่าเราสามารถเขียน code ในโลกของมันได้แบบปกติเลย โดยใช้ generator ทดแทน async/await โดยที่เขียนเป็น imperative ได้เลย โดยจะส่ง value ออกมา โดยใช้ Yield แทน มันก็เลยทำให้ Effect น่าสนใจมากในการจัดการกับ Error และโลกของ never throw any exception


1. เล่าคล้ายๆ อันนี้ [https://www.youtube.com/watch?v=zrNr3JVUc8I](https://www.youtube.com/watch?v=zrNr3JVUc8I)
	1. กับ [https://www.youtube.com/watch?v=PxIBWjiv3og](https://www.youtube.com/watch?v=PxIBWjiv3og)
	2. [https://youtu.be/SloZE4i4Zfk?si=j34szF3POk2F0p52](https://youtu.be/SloZE4i4Zfk?si=j34szF3POk2F0p52)
	3. [https://www.youtube.com/watch?v=Mikn2MXPaNg](https://www.youtube.com/watch?v=Mikn2MXPaNg)

## Introduction to Effect
- 

## Example
- 

## Conclusion

Effect เข้ามาเชื่อมระหว่าง 2 โลก ให้ง่ายขึ้นและเข้าใจง่ายขึ้น

และปัญหา Classic ของ ซึ่งที่ยังไม่ใช่ Standard คือ
มันยังไม่เป็น Standard ในโลก JavaScript มีการนำไปประยุกต์ใช้งานบางกลุ่ม
และยังไม่เหมาะสำหรับนำไปเขียนใน Library เท่าไหร่นัก

## Effect Ref

- Vote Result: [https://www.facebook.com/photo/?fbid=978877134241948&set=a.486562490140084](https://www.facebook.com/photo/?fbid=978877134241948&set=a.486562490140084)
- Effect
- [https://www.facebook.com/photo/?fbid=967347648728230&set=a.486562490140084](https://www.facebook.com/photo/?fbid=967347648728230&set=a.486562490140084)
- เริ่มเข้าใจและอยากเรียน Effect [https://youtu.be/Lz2J1NBnHK4](https://youtu.be/Lz2J1NBnHK4)
- High Level Effect Intro: [https://youtu.be/PxIBWjiv3og](https://youtu.be/PxIBWjiv3og?fbclid=IwZXh0bgNhZW0CMTAAAR3x4qRAHAKPdt91wF7VUZ90APhc5DzpqI3nCaVUV3Bj7kg-7beYPFKPv10_aem_tHgHxVonhN6RK8VlGcnHew)
- Slide: [https://2024-effect-days-keynote.vercel.app/1](https://2024-effect-days-keynote.vercel.app/1)
- [https://www.youtube.com/watch?v=7sJc3Z4mh1w](https://www.youtube.com/watch?v=7sJc3Z4mh1w)
    
- [https://youtu.be/zrNr3JVUc8I](https://youtu.be/zrNr3JVUc8I)
    
- [https://www.youtube.com/watch?v=BqUnsDnMnMo](https://www.youtube.com/watch?v=BqUnsDnMnMo)
    
- [https://www.youtube.com/watch?v=hWLjbTMLFPk](https://www.youtube.com/watch?v=hWLjbTMLFPk)
    
- [https://www.youtube.com/watch?v=dS2q2jYVhPE](https://www.youtube.com/watch?v=dS2q2jYVhPE)
    