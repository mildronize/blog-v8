+++
title = "ทริคการใช้ git: การ merge บางไฟล์ไปอีก branch"
description = "ทริคการใช้งาน git แบบง่ายสำหรับการ merge ไฟล์ไปอีก branch"
date = "2016-01-30"

[taxonomies]
categories = [ "git" ]
tags = [ "git", "How to" ]

[extra]
id = "2zgi1pu"
unsplashImgCoverId = "UT8LMo-wlyk"
+++

มีหลายๆ เทคนิคที่สามารถทำได้ วิธีนี้เป็นวิธีที่ง่ายที่สุด ซึ่งผมได้นำมาจากบทความของ [jasonrudolph.com](http://jasonrudolph.com/blog/2009/02/25/git-tip-how-to-merge-specific-files-from-another-branch/)

นั่นคือ ใช้ประโยชน์จาก `git checkout` นั่นเอง

สมมติว่า ผมมี 2 branches คือ `master` และ `mildronize-dotfiles` ตามผลลัพธ์ด้านล่าง ผมต้องการที่จะ merge ไฟล์ `README.md` จาก `mildronize-dotfiles` ไปยัง `master`
และทำการ commit ให้เรียบร้อย

```bash
$ git branch
  master
* mildronize-dotfiles
```

จากนั้นทำการย้าย branch ไปยัง `master`

```bash
$ git checkout master
```

จากนั้นใช้ `git checkout` เพื่อขอไฟล์ `README.md` จาก branch ของ `mildronize-dotfiles`
มายัง branch ปัจจุบัน (นั่นคือ `master`)

```bash
$ git checkout mildronize-dotfiles README.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        modified:   README.md

```

สังเกตุได้ว่า เมื่อใช้ `git status` ตรวรจสอบดูจะพบว่า ไฟล์ `README.md` ได้ถูกแก้ไขแล้ว
จากนั้นก็ commit ให้เรียบร้อย เป็นอันเสร็จสิ้นครับ

```bash
$ git commit -m "Merge readme into master branch"
```

จากนี้จะทำการ `push` หรืออะไรต่อก็แล้วแต่เลยครับ
