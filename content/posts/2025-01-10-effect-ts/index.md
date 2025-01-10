+++
title = "Effect: จัดการปัญหาที่ยากที่สุดของ JavaScript และจัดการ Error แบบปลอดภัยและ Type-Safety"
date = "2025-01-10"

[taxonomies]
tags = [ "Effect", "TypeScript", "Type-Safety" ]
categories = [ "TypeScript" ]

[extra]
id = "8wpo3jn"
+++


สวัสดีครับ วันนี้เรามาพบกับบทความ [Effect](https://effect.website/) ที่เคยสัญญากับลูกเพจ ThaiType ว่าจะมี Video และผมก็ได้พลัดมาเรื่อยๆ เนื่องจากไม่ค่อยได้จับ TypeScript ในงานเท่าไหร่ จนถึงเวลาที่ต้องเขียนบทความล่ะ 

{% note(header="Note") %}
ก่อนที่เริ่มอ่านบทความนี้ผมคาดหวังว่าทุกคนน่าจะเข้าใจ TypeScript, JavaScript, Promise มากพอ เนื่องจากเป็นเนื้อหาที่ค่อนข้าง Advanced ผมจะค่อยๆ ทยอยเรียบเรียงออกมาให้เข้าใจง่ายที่สุด ถ้าหากสงสัยตรงไหน สามารถเข้ามาพูดคุยหรือ สอบถามได้
{% end %}

ก่อนที่ไปเริ่มอ่านบทความ ผมอยากให้ทุกคนอ่านที่ Disclaimer ก่อน เพื่อให้เข้าใจบริบทของการเล่าเรื่องนี้ เนื่องจาก Effect เป็น Library ที่มีแนวคิดเฉพาะตัว และเกี่ยวข้องอย่างมากับ Functional Programming แต่ไม่จำเป็นต้องเข้าใจแนวคิดพวกนี้มาก่อนก็ได้ครับ

{% warning(header="Disclaimer") %}
ก่อนอื่นผมขอออกตัวก่อนนะครับ ผมเองไม่ได้มาสาย Functional Programming มาก่อน ดังนั้น กลุ่มเป้าหมายของบทความนี้คือกลุ่มคนที่เขียนโปรแกรมทั่วๆ ไปอย่าง Imperative Programming 

ดังนั้นคนที่เขียน Functional มาก่อนไม่ว่าจะเป็นภาษา  [Haskell](https://www.haskell.org/) หรือ[Scala](https://www.scala-lang.org/) หรือภาษาอื่นๆ ก็ตาม หากแนวคิดของ Functional ส่วนไหนผิดพลาดไป สามารถชี้แนะได้เลยนะครับ จะเป็นประโยชน์ต่อผู้อ่านท่านอื่นๆ มากเลยครับ 

สุดท้ายนี้ อย่างที่บอกไปว่าผมไม่ได้เน้นให้คนเขียน Functional อ่าน ดังนั้นผมคาดหวังว่าแค่เขียน TypeScript มาก็น่าจะอ่านเข้าใจได้ง่ายแล้ว และคนสร้าง Effect เอง ก็ต้องการซ่อนความเป็น Functional Programming ออกจาก Effect และเสนอ Programming Paradiagm ที่ใช้เฉพาะกับ Effect เท่านั้น เพื่อให้คนใช้งานสามารถใช้ได้ง่าย
{% end %}

## ปัญหาของ JavaScript/TypeScript
- `null` ในภาษา TypeScript
- No Type in Error when throwing Error

## Option/Result/Either
- .....

### References/State of the art

ก่อนหน้านี้หลายๆ คนก็ได้เคยพูดถึงเรื่องของ Option บ้าง Result บ้าง ในบทความต่างๆ ไม่ว่าไทยหรือ English

- พี่รูฟได้เขียนบทความถึง ["ทำไม null เป็นสิ่งที่ควรหลีกเลี่ยง (TypeScript)"](https://medium.com/odds-team/%E0%B8%97%E0%B8%B3%E0%B9%84%E0%B8%A1%E0%B9%88-null-%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%AA%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%84%E0%B8%A7%E0%B8%A3%E0%B8%AB%E0%B8%A5%E0%B8%B5%E0%B8%81%E0%B9%80%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%87-typescript-00be4f158df9) ว่าด้วยเรื่องปัญหาของการมีของ `null` ในภาษา TypeScript และสรุปปัญหาที่เกี่ยวข้องกับ `null` 
	- ภัยเงียบ: เมื่อค่าของตัวแปรเป็น null มักจะนำไปสู่ข้อผิดพลาด
	- .. (สรุป จาก พี่รูฟ)
- บทความจาก [Bret Cameron](https://bretcameron.medium.com/?source=post_page---byline--4e3c1a28a292--------------------------------) เรื่อง ["I Fixed Error Handling in JavaScript"](https://levelup.gitconnected.com/i-fixed-error-handling-in-javascript-4e3c1a28a292) ที่พูดถึง Concept Result และ Option ...
	- .....

และผมเองได้ก็มีโอกาสศึกษาและพัฒนา Library Option & Result ใช้งานเองที่ชื่อว่า [std-types](https://github.com/thaitype/std-typed) และทำให้เข้าใจว่าทำ Option และ Result ถึงไม่เป็นที่นิยม ทั้งๆ ที่หลายๆ ภาษาที่ไม่ใช่ Functional 

### ตัวอย่าง Library
- [neverthrow](https://github.com/supermacro/neverthrow)
- [ts-results](https://github.com/vultix/ts-results)

## ปัญหาของ Option และ Result

การที่ต้องแปลงระหว่าง 2 โลก ซึ่งมันไม่สะดวก

Effect.website ทำออกมาเนียบมาก คือ interope ระหว่าง 2 โลกแทบไม่มีเลย

เค้าใช้วิธีคือทิ้ง concept เดิมที่คนใช้อย่างแพร่หลายออกไปทั้งหมดเลย นั่นคือไม่สนใช้ Promise เพราะมัน handle expcected error ยาก แล้วนิยามใหม่ด้วย Object ที่ชื่อว่า Effect ทดแทน การใช้ Promise แบบเดิมทั้งหมดเลย

ซึ่ง Object Effect นั้นก็คล้ายๆ กับ Result ของ Higher Kind Type ใน Fp นั้นแหละ

แต่ก็มีตัว convert ข้ามไปข้ามมาระหว่างสองโลกนะ แต่ lib Result/Option ส่วนใหญ่พอแปลงไปแล้วมัน map ผลลัพธ์ที่ออกมาจาก Result ได้ไมาเยอะ จุดสุดท้าย ยังไงเราก็ต้องถูกบังคับให้ออกมาอยู่โลกของ Promise อยู่

แต่เจ้า Effect ที่ว่าเราสามารถเขียน code ในโลกของมันได้แบบปกติเลย โดยใช้ generator ทดแทน async/await โดยที่เขียนเป็น imperative ได้เลย โดยจะส่ง value ออกมา โดยใช้ Yield แทน มันก็เลยทำให้ Effect น่าสนใจมากในการจัดการกับ Error และโลกของ never throw any exception

## Why Effect


1. เล่าคล้ายๆ อันนี้ [https://www.youtube.com/watch?v=zrNr3JVUc8I](https://www.youtube.com/watch?v=zrNr3JVUc8I)
	1. กับ [https://www.youtube.com/watch?v=PxIBWjiv3og](https://www.youtube.com/watch?v=PxIBWjiv3og)
	2. [https://youtu.be/SloZE4i4Zfk?si=j34szF3POk2F0p52](https://youtu.be/SloZE4i4Zfk?si=j34szF3POk2F0p52)
	3. [https://www.youtube.com/watch?v=Mikn2MXPaNg](https://www.youtube.com/watch?v=Mikn2MXPaNg)

## Introduction to Effect
- 

## Example
- 

## Conclusion



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
    