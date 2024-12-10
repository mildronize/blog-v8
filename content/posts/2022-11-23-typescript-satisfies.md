+++
title = "TypeScript 4.9: มาใช้ satisfies เพื่อทำให้ Type ถูกต้องมากขึ้นกันเถอะ"
date = "2022-11-23"

[taxonomies]
categories = [ "TypeScript" ]
tags = [ "TypeScript" ]

[extra]
id = "7vzlyj3"
unsplashImgCoverId = "k4mEY-KBDnM"
+++

อย่างที่รู้กันว่าตอนนี้ [TypeScript 4.9](https://devblogs.microsoft.com/typescript/announcing-typescript-4-9/) release ออกมาแล้ว
มี feature หนึ่งที่น่าสนใจคือ `satisfies`

## Ex.1 - Safe Upcast

```ts
type RGB = readonly [red: number, green: number, blue: number];
type Color = { value: RGB | string };

const myColor = { value: 'red' } satisfies Color; // works
const myIncorrectColor = { value: 100 } satisfies Color; // throws error

myColor.value.toUpperCase(); // valid operation as myColor is a string
```

## Ex.2 - Safe Upcast

```ts
type Animal = { kind: "cat", meows: true } | { kind: "dog", barks: true };
let p = { kind: "cat" } as Animal; // Missing meows!
if (p.kind === "dog") {

} else {
    p.meows; // Reported 'true', actually 'undefined'
}
```

### Solution

```ts
let p = { kind: "cat", meows: true } satisfies Animal;
```

## Ex.3 - Property Name Constraining

```ts
type Keys = 'a' | 'b' | 'c' | 'd';

const p2 = {
    a: 0,
    b: "hello",
    x: 8 // Should error, 'x' isn't in 'Keys'
}

// Should be OK -- retain info that a is number and b is string
let a = p2.a.toFixed();
let b = p2.b.length;
// Should error even though 'd' is in 'Keys'
let d = p2.d;
```

### Solution

```ts
p2 satisfies Partial<Record<Keys, unknown>>;
```

## EX.4 - Property Name Fulfillment

```ts
type Keys2 = 'a' | 'b' | 'c' | 'd';

const p3 = {
    a: 0,
    b: "hello",
    c: true,
    // Should error because 'd' is missing
}
// Should be OK
const t: boolean = p3.c;
```

### Solution
```ts
p3 satisfies Record<Keys, unknown>;;
```

```ts

export type Color2 = { r: number, g: number, b: number };

// All of these should be Colors, but I only use some of them here.
const Palette = {
    white: { r: 255, g: 255, b: 255},
    black: { r: 0, g: 0, d: 0}, // <- oops! 'd' in place of 'b'
    blue: { r: 0, g: 0, b: 255 },
}

const Palette2 = {
    white: { r: 255, g: 255, b: 255},
    black: { r: 0, g: 0, d: 0}, // <- error is now detected
    blue: { r: 0, g: 0, b: 255 },
} satisfies Record<string, Color2>;
```

ขอบคุณตัวอย่างจาก  https://github.com/microsoft/TypeScript/issues/47920

## ศึกษาเพิ่ม

https://www.youtube.com/watch?v=6uJeT7y6CCo
