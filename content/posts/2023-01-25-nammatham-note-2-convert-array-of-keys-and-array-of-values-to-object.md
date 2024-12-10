+++
title = "Nammatham Note 2: Convert array of keys and array of values to object"
date = "2023-01-25"

[taxonomies]
categories = [ "TypeScript" ]
tags = [ "TypeScript", "Nammatham" ]

[extra]
uuid = "i6waft7"
unsplashImgCoverId = "PhvmLvBaBzE"
+++

This orignial question is from [Stackoverflow](https://stackoverflow.com/questions/67021405/ts-types-convert-arrays-of-keys-and-array-of-values-to-object). The [full description](https://catchts.com/tuples#zip) how to construct this type utility (from catchts.com)

```ts
type A = ["cat", "dog"];
type B = ["red", "yellow"];

type Expected = {
  cat: "red",
  dog: "yellow"
}
```

The original solution

```ts
type Length<T extends ReadonlyArray<any>> = T extends { length: infer L }
  ? L
  : never;

type CompareLength<
  X extends ReadonlyArray<any>,
  Y extends ReadonlyArray<any>
  > = Length<X> extends Length<Y> ? true : false;

/**
 * Let's operate on primitives
 */
type Keys = string | number | symbol;
type AllowedKeys<T> = T extends readonly Keys[] ? T : never;


type Mapper<T, U> = T extends Keys ? U extends Keys ? Record<T, U> : never : never;

/**
 * Recursive iteration through two arrays
 */
type Zip<
T extends ReadonlyArray<Keys>,
 U extends ReadonlyArray<Keys>,
 Result extends Record<string, any> = {}> =
  CompareLength<T, U> extends true
  ? T extends []
  ? Result :
  T extends [infer HeadT1]
  ? U extends [infer HeadU1]
  ? Result & Mapper<HeadT1, HeadU1> : never :
  T extends [infer HeadT2, ...infer TailT2]
  ? U extends [infer HeadU2, ...infer TailU2]
  ? Zip<AllowedKeys<TailT2>, AllowedKeys<TailU2>, Result & Mapper<HeadT2, HeadU2>>
  : never
  : never
  : never;

/**
 * Apply Zip only if arrays length is equal, otherwise return never
 */
type Zipper<T extends ReadonlyArray<Keys>, U extends ReadonlyArray<Keys>> =
  CompareLength<T, U> extends true ? Zip<T, U> : never;

type A = ["cat", "dog"];
type B = ["red", "yellow"];
type Result = Zipper<A, B>;

const zip: Result = {
  cat: "red",
  dog: "yellow"
} // ok
```

[playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAMhB2BzYALAPAFShAHsBAJgM5QBKEAhgQPbwA2IAggE7MUhoXwgB8PUAXihZc+eMSgBvKHQTIUALigBLeADMIzWFAC+AWABQUKAH5Yh40vgQAbpoDchw6EhQAwtQC2YCswhwkVDQLKAANbDxCEnIqWgYWNg4uXgAaEIBNCLEJGJp6JlZ2Tm4eEP4hAPk0UP5RKNg5IPT+M2BmAFdoJTUKOiIIRwNDAHoAKlGLUYbgAHISakg2fChaKDBmZU9lYGU7Iknh53BoAGkIEBIhIjbVRCgAHyh4ds8AI00HqCIQN+o6QZc0EYdDo1AA7hACGcLphysIsvU-LF8lBoUQANoAXVM8KstgcTgMgKgAFkKGBFpgUlAAKpwkSRcQkNE4mkIpmo84kMzkADG1GYBCptP4eLsWjFBKGBjGEyMUz57WYRF20G2mgoO1WqGY1HaiBQUGAYOoUF8iX28sOROOUAAWsowMEDAzstFKHl4oUOGieGkjGy6hzcnECok0L7-WQIER2nRgOychB+YK0NcNkhqck4ZIdOUQh5vL5-I10BhqXTEyQ2p0QmZXfUsXXo7H41AFCEGxz0aoNFoABIejAARkxzcDjIkPfUH0HVBpo+b5FbCYAZKTyZS5wQR9TtwvRU98RLO1WoNO+1BtxgAEzUgB0j97HwwFGUdFvY6MrLPF9nHppO8oEfe9ny0V930Ar9jDMB0nWBUEIShLlMDfD8bz9KAEPBSE0VQyCMOpZc4zXDcKU0NBryA-cMNKb9JWYEIGKYo9xUGEZxkmLCKQYe1HRWFFlDUM1vRIWRAkNZQSAgABHdpempahUE0MEpOgPxgCVeBWM0A4jlcODKS7JNkS9cNI1pM8Q3yBIil9fNv0LHw-EqIJyxFM8a2gWDHWFSsGPYm1XEYQRzwAIl5TUwupMKaEQMLMQBW0ACFQvRMK-AIaKoDCkAIBBcEEqS1xiLbIRDIoxhqWSnhAv5eBrigAAvR0lFKhMhEkEJIuAJQMshaKQjivq8oKsEwsMHQoGGYYVgAayAA)

I want the Type support value any type, not only `string | number | symbol` as already defined in:

```ts
type Keys = string | number | symbol;
type AllowedKeys<T> = T extends readonly Keys[] ? T : never;
```


## My Solution

[Playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAMhB2BzYALAPAFShAHsBAJgM5QBKEAhgQPbwA2IAggE7MUhoXwgB8PUAXihZc+eMSgBvKHQTIUALigBLeADMIzWFAC+UAPzal8CADdNAbgCwAKFCQoAYWoBbMBWYQ4SVGgAa2HiEJORUtAwsbBxcvAA0UACagWISoTT0TKzsnNx8grByvn78osEFPugJPLZQBlDAzACuEDVQSmoUdEQQ1ja2APQAVIM1gwXAAOQk1JBs+FC0UGDMyi7KwMrmRKP9tvbQANIQICRCRA2qiFAAPlDwjS4ARpo3UEQgT9R0vftQALIUMCzTDxACq-CEIiC4hIRxOdTIEAAxtRmAQQVBwbVjGZLLY9uBoIw6HRqAB3CAEOFETAQ4TJMqeMIZKDUgDaAF06lgceZmL0BsNRoikY1mERNtB1poKBtFqhmNRGogUPUydQoB4otsbFBBrs7ISoAAtZRgNCtKEpEKUdIRLIcak8WKtUEMmGI5n2qI5OKtchERp0YDu1LI1Ho84rJDxGJ0yQ6Wx05xuDxeQroDBgkrQiQNZqtQxWsqc1q1QwBoPAMttemlD1s1QaLQACVtGAAjBya4Y3fWJI31C821RQV2a+XEYHg1AAGT-QHAkcETvxZdj6q62rb3maGtKYsNpvD9sAJniADor8etBgKMo6BhT92t5O+7mSIPm1B1+eoFeLxvYR7zoUFnwnOpTXNYlSQpKljhpO8HyfZ1gIfMD4krGd5wBIFNDQZcnzXW0wL4CDd2Yfc7lxSitwogUbCGEZdTGRggQYE0zQWFllDUTUHRIWQKhUEgIAAR0aTp4moVBNDJZRuigTxgDFeBqL5HYCQcKDgUPMMvUyH0nTBUMbQMyJsjjZNXHcTxvHkDEsX7Eh8xaLdDCgxzN2xdS8T6GwkToCgiBtAgpETAKgpCxIIBJclwvxQ0HEYfI2QAIiRWU0viNKaEQNKOR+I0ACFUvIAh4gSWLYMKrToCwkMhB0-DGHiYqeAYlF4HOKAAC8zSUBr8kkVpMuAQbKRdLc8qUKq4rJWw9H6foFgAayAA)

To modify the original code, I've revise

```ts
type Keys = string | number | symbol;
type Mapper<T, U> = T extends Keys
  ? U extends Keys
    ? Record<T, U>
    : never
  : never;
```

โดยตัว `Mapper` ต้องการ value ของที่จะมา Map (`U`) เป็น `Keys` เท่านั้น ซึ่งก็คือ `string | number | symbol` อย่างใดอย่างหนึ่ง
ซึ่งผมต้องการให้ `Mapper` รับ value ที่เป็นอะไรก็ได้

ดังนั้นจึงเหลือแค่เช็คว่า Key ที่รับเข้ามาเป็น Valid key หรือไม่ ซึ่งก็คือ  `string | number | symbol`

```ts
type Mapper<T, U> = T extends Keys ? Record<T, U> : never;
```

จุดที่ 2 ที่แก้ไขก็คือ การนิยาย type `Zip`

```ts
type Keys = string | number | symbol;
type Zip<
  T extends ReadonlyArray<Keys>,
  U extends ReadonlyArray<Keys>,
  Result extends Record<string, any> = {}
> = // ...
```

โดยที่ Type รับ parameter 2 ตัวที่เป็น Readonly Array ที่เป็น `Key` ทั้ง key และ value เลยจึงทำให้ในการใช้งาน `Zip`

```ts
                    // v--- 2nd parameter needs to be `string | number | symbol`
Zip<["cat", "dog"], ["red", "yellow"]>;
```

จึงแก้ไขให้รับ `any` type แทน

## Final Solution

```ts
type Length<T extends ReadonlyArray<any>> = T extends { length: infer L } ? L : never;
type CompareLength<X extends ReadonlyArray<any>, Y extends ReadonlyArray<any>> = Length<X> extends Length<Y>
  ? true
  : false;

/**
 * Let's operate on primitives
 */
type Keys = string | number | symbol;
type Mapper<T, U> = T extends Keys ?  Record<T, U>  : never;

type AllowedKeys<T> = T extends readonly Keys[] ? T : never;

/**
 * Recursive iteration through two arrays
 */
type Zip<
  T extends ReadonlyArray<Keys>,
  U extends ReadonlyArray<any>,
  Result extends Record<string, any> = {}
> = CompareLength<T, U> extends true
  ? T extends []
    ? Result
    : T extends [infer HeadT1]
    ? U extends [infer HeadU1]
      ? Result & Mapper<HeadT1, HeadU1>
      : never
    : T extends [infer HeadT2, ...infer TailT2]
    ? U extends [infer HeadU2, ...infer TailU2]
      ? Zip<AllowedKeys<TailT2>, TailU2, Result & Mapper<HeadT2, HeadU2>>
      : never
    : never
  : never;

/**
 * Apply Zip only if arrays length is equal, otherwise return never
 */
type Zipper<T extends ReadonlyArray<Keys>, U extends ReadonlyArray<any>> = CompareLength<T, U> extends true
  ? Zip<T, U>
  : never;

class Red {}
class Yellow {}

type A = ["cat", "dog"];
type B = [Red, Yellow];
type Result = Zipper<A, B>;

const zip: Result = {
  cat: Red,
  dog: Yellow
} // ok
```
