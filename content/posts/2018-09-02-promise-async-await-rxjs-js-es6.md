+++
title = "Promise, Async, Await ของ JS ES6+ ฉบับสั้นๆ ไม่พูดเยอะ เจ็บคอ แถม RxJS"
date = "2018-09-02"

[taxonomies]
tags = [ "Promise", "JavaScript", "ES6", "Async/Await" ]
categories = [ "Promise" ]

[extra]
image = "https://www.dropbox.com/s/53ds3aqow09hl0g/cover.jpeg?raw=1"
id = "leu0374"
unsplashImgCoverId = "hopnkQoC0dg"
+++

> **อ่านฉันหน่อย**:  บทความนี้ใช้ javascript ES6 นะครับ ใครยังไม่ชินไปตามอ่านได้ใน Cheat sheet นี้เลย มีภาษาไทยด้วย
>
> https://github.com/mbeaudru/modern-js-cheatsheet/blob/master/translations/th-TH.md

> **หมายเหตุ ต่อไป:**  ผมเขียน Python, C เป็นหลักนะครับ Java เป็นรอง แต่เขียน Async บน Java ด้วย ดังนั้น อาจจะไม่ถูกใจขา JS

สวัสดีครับ บล็อกนี้มาสั้นๆ ไม่เกริ่นทีมา ว่าทำไมถึงใช้ และหลักการต่างๆ ข้ามไว้ก่อน เพราะเราขี้เกียจเขียน (ไว้ค่อยกลับมาเขียน 555)

**สรุปสั้นๆ**

- ใช้ **Promise** เพื่อแก้ปัญหา Callback Hell
- ใช้ **Async, Await** เพื่อไม่ต้องใช้ `.then()` แล้วยังไงล่ะ ไปดู
- เนื่องจาก Promise `resolve` ได้แค่ครั้งเดียว ถ้าอยาก `resolve` หลายครั้ง เช่นข้อมูลแบบ stream ใช้ **RxJS** เพื่อแก้ปัญหา

สรุปจบ ไปดูโค๊ด

เราจะเขียน Promise กันง่ายๆ คือ ให้ฟังชั่นที่ทำงานนานๆ ตัวนึงชื่อ `upperAfter` โดยทำหน้าที่แปลงเป็นตัวพิมพ์ใหญ่ หลังจาก 2 วินาที ไปดูตัวอย่างกัน

![promise](https://www.dropbox.com/s/7se4umjvmx1jbgx/promise.gif?raw=1)

## 1. Promise

```js
const upperAfter = (text, ms) => (
  new Promise(
    resolve => setTimeout(() => resolve(text.toUpperCase()), ms)
  )
);

const main = () => {
  console.log("start upperAfter('test',2000)")
  upperAfter('test',2000)
    .then( data => {
      console.log(data)
      console.log("Finish upperAfter('test',2000)")
    })
}
```

เมื่อเรารัน `main()` แล้ว มันจะทำงานดังนี้

1. เรียก `upperAfter('test',2000)` จะ return เป็น Promise ออกมา
2. object ของ promise จะสามารถต่อด้วย `.then()` หรือ `.catch()` ก็ได้
   - ถ้าทำสำเร็จก็ใช้ `.then()`  (คือค่า ที่ถูก *resolve* ออกมา ในที่นี้คือ `text.toUpperCase()`)
   - ถ้าทำไม่สำเร็จก็ใช้ `.catch() ` (คือค่า ที่ถูก *reject* ออกมา )
3. เมื่อเรียก `.then()` ค่าของข้อความจะมาใส่มาใน `data` เราก็สามารถเอา `data` ไปต้มยำทำแกงอะไรก็ได้ เย้ จบ!

**ข้อสังเกตุ** คือเราใช้ `.then()` เพื่อทำให้ Blocking i/O หรือ Synchronous นั้นเอง คล้ายกับการเรียก callback นั้นแล แต่ `.then()` เราสามารถต่อกันได้ ทำให้โค้ดสวยมากขึ้น และ debug ง่ายขึ้นนะ

## 2. Async, Await

เอาโค้ดข้างบนมาแก้ `main` ใหม่

```js
const main = async () => {
  console.log("start upperAfter('test',2000)")
  const data = await upperAfter('test',2000)
  console.log(data)
  console.log("Finish upperAfter('test',2000)")
}
```

เป็นไงล่ะ ทำงานได้เหมือนเดิม แต่ชีวิตง่ายขึ้นมั้ย ทีนี้เราก็ทำตัวเหมือนเขียน Blocking I/O หรือ Synchronous  แบบ C, Python ได้แล้ว เจ๋งป่ะล่ะ

**ข้อสังเกตุ** ฟังก์ชัน `main()` ต้องเป็น `async` เพื่อบอกว่าฟังก์ชันนี้มี การทำ blocking I/O หรือ Synchronous อยู่นะ  เราใส่ `await` หน้า promise นั้นเอง มันจะ auto `.then()` ให้เลย สะดวกสุดๆ

 ในบรรทัดนี้ `const data = await upperAfter('test',2000)` อารมณ์เหมือนเราได้ค่า `data` มาเลย แล้วก็เอาไปทำอะไรต่อก็ได้ ไม่ต้องอยู่ใน `.then()` แล้ว

## ก่อนปิดบล็อก

อ่าวจบแล้ว? RxJS ล่ะ เอาแค่นี้ก่อน พอรู้ข้อจำกัดของการใช้ Promise แล้ว คราวหน้า เราสามารถไปใช้ RxJS ได้

### ของแถม แล้ว **Promise** มาช่วยแก้ปัญหา Callback Hell  ยังไง

อันนี้เอาตัวอย่างมาจาก โปรเจ็ค `promise-it-wont-hurt` ของ https://nodeschool.io/

อันนี้เค้าเรียกกันว่า Callback Hell ถ้ามีมากกว่าหลายชั้นก็นี้ก็ hell จริงๆ ละคับ

```js
Parse.User.logIn('user', 'pass', {
  success: function (user) {
    query.find({
      success: function (results) {
        results[0].save({ key: value }, {
          success: function (result) {
            // the object was saved
          }
        });
      }
    });
  }
});
```

แล้วถ้าใช้ Promise ช่วยล่ะ

```js
Parse.User.logIn('user', 'pass').then(function (user) {
  return query.find();
}).then(function (results) {
  return results[0].save({ key: value });
}).then(function (result) {
  // the object was saved
}).catch(function (err) {
  // an error happened somewhere in the process
});
```

เป็นไงบ้าง ดูง่ายขึ้นเยอะมั้ย ครับ

พอล่ะไม่อธิบายเยอะ เจ็บขอ แล้วพบกันใหม่ครับ

### อ่านเพิ่มเติม

- [Modern JS Cheat sheet](https://github.com/mbeaudru/modern-js-cheatsheet)  one-stop cheat sheet for JS developer
- https://nodeschool.io/ เว็บนี้ก็ดีงาม สอน JS แบบ interactive เลย
- ES6 Cheat sheet: https://github.com/DrkSephy/es6-cheatsheet อันนี้ก็ดีนะ ไปดูได้


---

 *Cross published at [Medium.com](https://medium.com/@mildronize/promise-async-await-%E0%B8%82%E0%B8%AD%E0%B8%87-js-es6-%E0%B8%89%E0%B8%9A%E0%B8%B1%E0%B8%9A%E0%B8%9C%E0%B8%AD%E0%B8%A1%E0%B9%80%E0%B8%9E%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%A7-%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B8%9E%E0%B8%B9%E0%B8%94%E0%B9%80%E0%B8%A2%E0%B8%AD%E0%B8%B0-%E0%B9%80%E0%B8%88%E0%B9%87%E0%B8%9A%E0%B8%84%E0%B8%AD-%E0%B9%81%E0%B8%96%E0%B8%A1-rxjs-12b9e7b32392)*
