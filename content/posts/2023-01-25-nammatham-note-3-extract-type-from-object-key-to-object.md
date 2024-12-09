+++
title = "Nammatham Note 3: Extract Type from Object Key to Mapped Object"
date = "2023-01-25"

[taxonomies]
categories = [ "TypeScript" ]
tags = [ "TypeScript", "Nammatham" ]

[extra]
uuid = "ziwr7je"
unsplashImgCoverId = "k4mEY-KBDnM"
+++

สวัสดีคับ ผมหวังว่าผู้อ่านน่าจะคุ้นเคย Azure Function TypeScript มาพอสมควรแล้ว ถ้ายังไม่คุ้นก็เดี๋ยวจะได้เริ่มคุ้นเลยนะ
 เย้

จาก Issuse #24 (https://github.com/mildronize/nammatham/issues/24)

(Refer to `@azure/functions@3.5.x`)

The `Context.bindings` is type [ContextBindings](https://github.com/Azure/azure-functions-nodejs-library/blob/v3.x/types/Context.d.ts#L76-L79).

This will accept `string` from [the source](https://github.com/Azure/azure-functions-nodejs-library/blob/v3.x/types/Context.d.ts#L21-L24)
> Input and trigger binding data, as defined in function.json. Properties on this object are dynamically generated and named based off of the "name" property in function.json.

here is the definition of `Context Binding`

```ts
/**
 * Context bindings object. Provided to your function binding data, as defined in function.json.
 */
export interface ContextBindings {
    [name: string]: any;
}
```

## Expected Behavior

If we binding function with name `response` in `function.json`

```json
{
  "bindings": [
    {
      "type": "http",
      "direction": "out",
      "name": "response"
    }
  ]
}
```

The type should allow only `Context.bindings.response` type, not any `string` type.


## Solution

```ts
import { AuthorizationLevel, BaseController, controller, functionName } from 'nammatham';
import { Context, ContextBindings, HttpRequest } from '@azure/functions';
// import { BindingTypeEnum } from 'inversify';
import type { UnionToIntersection } from 'type-fest';
import { type } from 'os';


// https://catchts.com/union-array
// Converts union to overloaded function
type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

// Finally me)
type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A];
// https://catchts.com/union-array

export interface BaseFunctionBinding<T, N> {
  type: T;
  direction: 'in' | 'out';
  name: N;
}

export interface HttpTriggerResponseBinding<T> extends BaseFunctionBinding<'http', T> {
  name: T;
  type: 'http';
  direction: 'out';
}

export interface HttpTriggerRequestBinding<T> extends BaseFunctionBinding<'httpTrigger', T> {
  name: T;
  type: 'httpTrigger';
  direction: 'in';
  route?: string;
}

/**
 * Custom Function Binding can assign any type value
 */
export interface CustomFunctionBinding<T> extends BaseFunctionBinding<string, T>, Record<string, any> {
  name: T;
  type: string;
}

export type DefinedFunctionBinding<T extends unknown> = HttpTriggerRequestBinding<T> | HttpTriggerResponseBinding<T>;

const bindings = [
  {
    name: 'req',
    type: 'httpTrigger',
    direction: 'in',
    route: '/home',
  } as HttpTriggerRequestBinding<'req'>,
  {
    name: 'res',
    direction: 'out',
    type: 'http',
  } as HttpTriggerResponseBinding<'res'>,
] as const;

type BindingType = typeof bindings[number];
type BindingTypeName = UnionToArray<BindingType['name']>;
type BindingTypeArray = UnionToArray<BindingType['type']>;

type AllBindings = DefinedFunctionBinding<unknown>['type']; // type AllBindings = "http" | "httpTrigger"
type GetBindingObjectFromType<T extends AllBindings> = T extends 'httpTrigger' ? HttpRequest : any;
type GetBindingObjectArray<T extends AllBindings[]> = T extends [infer Head, ...infer Tail]
  ? Head extends AllBindings
    ? Tail extends AllBindings[]
      ? [GetBindingObjectFromType<Head>, ...GetBindingObjectArray<Tail>]
      : []
    : []
  : [];
type BindingObjectArray = GetBindingObjectArray<BindingTypeArray>;

// https://catchts.com/tuples
type BindingTypeMapping = Zipper<BindingTypeName, BindingObjectArray>;

type MyContextBindings = ContextBindings & BindingTypeMapping;
const myContextBindings: MyContextBindings = {
  // Mock type
  req: {} as HttpRequest,
  res: '',
}
myContextBindings.req.headers;


@controller()
export class MyHttpController extends BaseController {
  @functionName('MyHttp', ...bindings)
  public getName(req: HttpRequest): void {
    const name = req.query.name;
    this.context.log('Context Log');
    this.context.bindings.req;
    // this.res.send(`hello get user with ${name}`);
    this.res.json({
      data: `[MyHttp] hello get user with ${name}}`,
    });
  }
}
```


## Read More จ๊ะ

- How to make a map object type from a union type in TypeScript? !!! https://melvingeorge.me/blog/make-map-object-type-from-union-types-typescript
- https://catchts.com/union-array
- https://stackoverflow.com/questions/65375625/typescript-convert-union-of-similar-objects-to-object-type
- https://stackoverflow.com/questions/60862509/typescript-types-from-array-to-object
  - Use `UnionToIntersection` from `type-fest`
