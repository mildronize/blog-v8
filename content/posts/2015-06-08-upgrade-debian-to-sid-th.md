+++
title = "มาอัพเดท Debian จากเวอร์ชั่น stable มาเป็น sid กันเถอะ"
description = "ขั้นตอนการอัพเกรดระบบ Debian จาก stable sid, การทำให้ user สามารถใช้สิทธิผู้ดูแลระบบได้(root) และการติดตั้ง non-free packages(non open source)"
date = "2015-06-08"

[taxonomies]
categories = [ "Debian" ]
tags = [ "Debian", "How to", "Firmware Linux" ]

[extra]
last_modified_at = 2016-02-16T00:00:00.000Z
uuid = "e52fdze"
unsplashImgCoverId = "raNIrcd39jY"
+++

โดยปกติแล้ว เวลาลง Debian ใหม่ๆ จะไม่สามารถใช้ คำสั่ง sudo ได้ ไม่เหมือนกับ Ubuntu ที่ตอนติดตั้งจะให้ user แรกที่สร้างตอนติดตั้งสามารถใช้ คำสั่ง sudo ได้เลย

ดังนั้น เพื่อให้ user ของเราเองมีสิทธิเทียบเท่าผู้ดูแลระบบ(system administrators ) เราจึงต้องลง package ชื่อว่า sudo และใช้สิทธิผู้ดูแลระบบอนุญาตให้ user ของเรามีสิทธิเทียบเท่าผู้ดูแลระบบ เพราะในบางคำสั่งจำเป็นต้องใช้สิทธิ ผู้ดูแลระบบในการทำงาน เช่น การติดตั้ง โปรแกรม (หรือ package) โดยใช้คำสั่งด้านล่างนี้

```bash
$ su
# aptitude install sudo
# usermod -a -G sudo [USERNAME]
# exit
```

> [sudo](https://wiki.debian.org/sudo) คือ คำสั่งที่ให้ ผู้ดูแลระบบ อนุญาตให้่บาง user สามารถใช้คำสั่งที่ได้สิทธิเทียบเท่าผู้ดูแลระบบได้

## ขั้นตอน

1. ให้คัดลอกข้อความด้านล่างนี้แทนที่ ของเดิมไปเลย โดยไปไว้ที่ `/etc/apt/sorces.list` กับโปรแกรมแก้ไขข้อความตัวไหนก็ได้ที่คุณชอบ โดยในที่นี้ผมจะใช้ vi โดยใช้ `$ sudo vi /etc/apt/sources.list` และคัดลอกข้อมูลด้านล่างลงไปแล้วก็บันทึก

    ```bash
    deb http://ftp.th.debian.org/debian/ sid main contrib non-free
    deb-src http://ftp.th.debian.org/debian/ sid main contrib non-free

    deb http://ftp.th.debian.org/debian/ stable main contrib non-free
    deb http://ftp.th.debian.org/debian/ testing main contrib non-free
    deb http://ftp.th.debian.org/debian/ experimental main contrib non-free
    ```
    > Read more about Archive areas:
    > [main](https://www.debian.org/doc/debian-policy/ch-archive.html#s-main),
    > [contrib](https://www.debian.org/doc/debian-policy/ch-archive.html#s-contrib),
    > [non-free](https://www.debian.org/doc/debian-policy/ch-archive.html#s-non-free)

    > Note: Replace `http://ftp.th.debian.org/debian/` to your nearest repository

2. ทำการอัพเดทรายการ package ทั้งหมดที่อยู่ใน repository ที่เราใส่ไว้ในข้อที่ 1

    ```bash
    $ sudo aptitude update
    ```

2. จากนั้นทำการอัพเกรดระบบ Debain ไปยัง sid (หรือ unstable)

    ```bash
    $ sudo aptitude dist-upgrade
    ```
3. เมื่อเสร็จสิ้น สั่งรีบูตเครื่อง

    ```bash
    $ sudo reboot
    ```

## เพิ่มเติม จะลงก็ได้ไม่ลงก็ได้:

- การลง firmware บางตัวที่มี [non-free](https://www.debian.org/doc/debian-policy/ch-archive.html#s-non-free) อยู่ด้วยเช่น drivers เพื่อให้สามารถใช้ driver บางอันได้

    > สรุปคือลงๆ ไปเถอะ คือบาง driver เช่น `driver การ์ดจอ` มันไม่ใช่ open source แต่เราสามารถใช้งานได้ฟรี ดังนั้นลงๆ ตัวนี้ไปเถอะ จะได้มี driver ใช้

    ```
    $ sudo aptitude install firmware-linux
    ```

- ถ้าลง Debian ใหม่้ๆ แล้วจะไม่มีภาษาไทยมาให้ ตัวอักษรจะเป็นภาษาที่อ่านไม่ออก ดังนั้นควรจะลง `xfonts-thai` ด้วย จะได้อ่านภาษาไทยได้ สรุปคือลงๆ ไปเถอะถ้าเป็นคนไทย

    ```
    $ sudo aptitude install xfonts-thai
    ```
