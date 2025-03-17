+++
title = "พัฒนาโค้ดให้ทำงานได้ทุกที่: แนวคิดของ JavaScript Runtime Agnostic"
date = "2025-03-17"
draft = true

[taxonomies]
categories = [ "JavaScript" ]
tags = [ "JavaScript", "Runtime Agnostic"]

+++


## **Runtime Agnostic Library Catalog (Edge Runtime Support)**
These libraries can run in non-Node.js environments.

- **[bcrypt-ts](https://github.com/Mister-Hope/bcrypt-ts)**  
  - Alternative to `argon2` and other bcrypt libraries.  
  - Ref: [YouTube](https://youtu.be/Yliaah4oiZY?t=80).  

- **[ioctopus](https://github.com/Evyweb/ioctopus)**  
  - IOC (Inversion of Control) container for TypeScript without `reflect-metadata`.  
  - Ref: [YouTube](https://www.youtube.com/watch?v=Yliaah4oiZY).  
  - Read more: [Next.js Clean Architecture PR](https://github.com/nikolovlazar/nextjs-clean-architecture/pull/11) (Refactoring for Vercel Edge & other runtimes).  

- **[authjs](https://authjs.dev/guides/edge-compatibility)**  
  - Ref: [Edge Compatibility Guide](https://authjs.dev/guides/edge-compatibility).  
- [h3](https://h3.unjs.io/)
	- The Web Framework for Modern JavaScript Era, HTTP server framework built for high performance and portability running in any JavaScript runtime.

## **Libraries That Depend on Node.js**
These require a Node.js runtime.

- **[@azure/data-tables](https://www.npmjs.com/package/@azure/data-tables)**  
  - Azure Table Client.  
  - Ref: [GitHub Issue](https://github.com/mildronize/lumebot/issues/2).  

# Tools that make it possible
- [unenv](https://github.com/unjs/unenv) -- Node.js compatibility for any JavaScript runtime, including browsers and edge workers.
	- For Example, if you want to use `node:crypto` which only specific node.js runtime, for all list package support checkout the repo.


# References

- https://www.telerik.com/blogs/building-runtime-agnostic-apps-packages-javascript
- https://rapidjs.org/blog/post?s=runtime-environment-agnosticism#runtime-detection


# Prompt

ช่วยเขียนบทความ โดยใช้ภาษาพูด โดยใช้ Outline หรือ Draft ต่อไปนี้

หัวข้อ: พัฒนาโค้ดให้ทำงานได้ทุกที่: แนวคิดของ JavaScript Runtime Agnostic

Ref: