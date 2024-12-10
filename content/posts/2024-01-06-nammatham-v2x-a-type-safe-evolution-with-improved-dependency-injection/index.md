+++
title = "Nammatham v2.x: A Type-Safe Evolution with Improved Dependency Injection"

[taxonomies]
categories = [ "blog" ]
tags = [
  "blog",
  "nammatham",
  "diextra",
  "typesafe",
  "decorator",
  "serverless",
  "azure",
  "azureFunctions",
  "express",
  "trpc"
]

[extra]
uuid = "bcx6ncq"
+++


## Introduction:

When developing Nammatham v1.x, I acknowledged that the experience was somewhat limited. The integration with Dependency Injection (Inversify) was overly complex, leading to constraints in scalability and extensibility. 🥲

Nammatham v2.x, on the other hand, underwent a complete overhaul! 🥳 We eliminated the tight coupling with Inversify and reduced the reliance on decorators, making it more type-safe. This version now supports easier expansion, steering away from the limitations of the past. 

For instance, it seamlessly integrates with Express for Azure Functions Dev, providing an alternative to the official approach, which suffered from slow startup times and the need to compile to JS before debugging. Additionally, libraries like tRPC are now compatible and contribute to the overall improved developer experience. 🤗

## Getting to the Point:

After successfully proving the concept with Nammatham v2.x, supporting Azure Functions v4 models with enhanced type safety and developer experience, a new challenge arose. The existing production code of v1.x heavily relied on Inversify's robust container. How could we address this without the need for a complete code rewrite? 🤩

## The Solution:

We decided to create helper functions that are type-safe and assist in resolving service dependencies for Inversify. This approach allows for a graceful migration from v1.x to v2.x without the need to overhaul the existing codebase. It's a work in progress (all libraries are currently in alpha stage with rigorous testing ongoing), but it holds promise for a smooth transition, as depicted in the image below. 👇👇

![](compare.png)

For those interested in the code, feel free to explore and give it a star if you find it useful! 📣

- Nammatham: https://github.com/thaitype/nammatham
- di-extra: https://github.com/thaitype/di-extra

P.S. Nammatham is a TypeScript library designed to facilitate the development of serverless functions, such as Azure Functions and others in the future (assuming contributions are made 🙏).
