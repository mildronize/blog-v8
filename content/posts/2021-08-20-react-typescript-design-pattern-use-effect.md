+++
title = "จัดการ side effects ใน React ด้วย Hook useEffect"
date = "2021-08-20"

[taxonomies]
categories = [ "React" ]
tags = [
  "React",
  "React Hook",
  "Design pattern",
  "Functional Component",
  "TypeScript"
]

[extra]
uuid = "wes5jlp"
unsplashImgCoverId = "ZfczAO3uDzc"
+++

Side effects เป็น function โดยส่วนใหญ่แล้ว เราจะจัดการกับ Side Effect ของ Component โดยมี 3 scenarios:
- ทำงานเฉพาะครั้งแรกที่ Component mount (Only when a component mounts)
- เคลียร์ค่าต่างๆ โดยใช้ return a function (Cleaning up by returning a function)
- ทำงานเมื่อ dependencies มีการเปลี่ยนแปลง (Running when specific dependencies change)a

## 1. ทำงานเฉพาะครั้งแรกที่ Component mount

จะทำครั้งแรก ครั้งเดียวเมื่อ Component โหลดเสร็จ

```tsx
function FirstExecuteComponent() {

  // Add event listeners (Flux Store, WebSocket, document, etc.)
  useEffect(
    () => console.log("Component loaded"),
    []
  );
  return null;
}
```

ข้อสังเกตุ `useEffect` ต้องการรับ 2 parameters ถ้าอยากให้เหมือน `componentDidMount()` ให้ใส่ Array เปล่าๆ ใน parameters ตัวที่สอง `[]`

## 2. เคลียร์ค่าต่างๆ โดยใช้ return a function

จะทำงานครั้งสุดท้ายครั้งเดียวก่อนที่ Component ถูกเอาออก (Component is unmounted and destroyed)

```tsx
function FirstAndLastExecuteComponent() {

  // Remove event listeners (Flux Store, WebSocket, document, etc.)
  useEffect(
    () => {
        console.log("Component loaded");
        return () => console.log("Component unloaded");
    },
    []
  );
  return null;
}
```

เราสามารถใช้ประโยชน์จาก function `useEffect` ได้ ตรงที่ return ของ parameters ตัวแรกของ `useEffect` โดยเราสามารถ remove event listeners หรือล้างข้อมูลอะไรบางอย่าง ก็ได้ครับ

### ตัวอย่างการเคลียร์ค่า EventListener ของ Window Resize

```tsx
import React, { useState, useEffect } from "react";

function getWindowSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export default function WindowSize() {
  const [size, setSize] = useState(getWindowSize());

  useEffect(() => {
    const handleResize = () => {
      setSize(getWindowSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <p>
      Width: {size.width}, Height: {size.height}
    </p>
  );
}
```

## 3. ทำงานเมื่อ dependencies มีการเปลี่ยนแปลง

เราสามารถใส่ dependencies ที่อยากตรวจสอบได้ เช่น เมื่อ toggle มีการเปลี่ยนแปลงค่า จากที่ User เป็นคนคลิก ให้เรียก side effect เป็นต้น ดังตัวอย่างข้างล่างนี้

```tsx
import React, { useState, useEffect } from "react";

export default function DetectChange() {
  const [toggle, setToggle] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const toggleMessage = toggle ? "True" : "False";
    setMessage(toggleMessage);
  }, [toggle]);

  return (
    <p>
      <button onClick={() => setToggle(!toggle)}>Toggle</button>
      <h1>{message}</h1>
    </p>
  );
}
```

Note: ตัวอย่างนี้ไม่ใช่วิธีการที่ดีในการควบคุม state เขียนอธิบายการทำงานเท่านั้น


---


*Cross published at [.NET Thailand](https://www.dotnetthailand.com/frontend-web/react-typescript/design-pattern)*

*Acknowledgement: Thank you .net thailand team to review this article: [dotnetthailand.github.io#84](https://github.com/dotnetthailand/dotnetthailand.github.io/pull/84/files)*
