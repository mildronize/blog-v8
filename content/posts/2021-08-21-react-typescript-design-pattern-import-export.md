+++
title = "React Import & Export Component Pattern"
date = "2021-08-21"

[taxonomies]
categories = [ "React" ]
tags = [
  "React",
  "Design pattern",
  "functional-component",
  "TypeScript"
]

[extra]
id = "whaab42"
unsplashImgCoverId = "L8KQIPCODV8"
+++

## Default export

```tsx
// MyComponent.tsx
const MyComponent = () => <div>Hey, MyComponent</div>;
export default MyComponent;

// App.tsx
import MyComponent from './MyComponent';
```

## Export

```tsx
// MyComponent.tsx
export const MyComponent = () => <div>Hey, MyComponent</div>;

// App.tsx
import { MyComponent } from './MyComponent';
```

## Rename import

```tsx
// MyComponent.tsx
export const MyComponent = () => <div>Hey, MyComponent</div>;

// App.tsx
import { MyComponent as MySuperComponent } from './MyComponent';
export const App = () => <MySuperComponent />;
```

## Group all imports and rename

```tsx
// MyComponent.tsx
export const Switch = () => <div>Hey, Switch</div>;
export const Group = () => <div>Hey, Group</div>;

// App.tsx
import { * as MyComponent } from './MyComponent';
export const App = () => (
    <>
        <MyComponent.Switch />
        <MyComponent.Group />
    </>
);
```

## Re-export all

```tsx
// MyComponent.tsx
export const Switch = () => <div>Hey, Switch</div>;
export const Group = () => <div>Hey, Group</div>;

// MyParentComponent.tsx
export * from "./MyComponent";

// App.tsx
import { Switch, Group } from './MyParentComponent';
export const App = () => (
    <>
        <Switch />
        <Group />
    </>
);
```

## Re-export, then group all imports and rename

```tsx
// MyComponent.tsx
export const Switch = () => <div>Hey, Switch</div>;
export const Group = () => <div>Hey, Group</div>;

// MyParentComponent.tsx
export  * as MyComponent from "./MyComponent";

// App.tsx
import { MyComponent } from './MyParentComponent';
export const App = () => (
    <>
        <MyComponent.Switch />
        <MyComponent.Group />
    </>
);
```

## Export type

```tsx
// MyComponent.tsx
export type Gender = "Male" | "Female"; // Accept only "Male" or "Female"

// App.tsx
import { Gender } from './MyComponent'
```

## Export interface

```tsx
// MyComponent.tsx
export interface IUser {
    id: string;
    name: string;
}

// App.tsx
import { IUser } from './MyComponent'
```

---


*Cross published at [.NET Thailand](https://www.dotnetthailand.com/frontend-web/react-typescript/design-pattern)*

*Acknowledgement: Thank you .net thailand team to review this article: [dotnetthailand.github.io#84](https://github.com/dotnetthailand/dotnetthailand.github.io/pull/84/files)*
