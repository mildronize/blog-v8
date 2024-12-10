+++
title = "วิธีการติดตั้ง Google Chrome บน Debian"
description = "วิธีการติดตั้งทีละขั้นตอนผ่าน Google repository และการแก้ปัญหาข้อผิดพลากของ public key ในการเพิ่ม repository ใหม่"
date = "2015-06-22"

[taxonomies]
tags = [ "Debian", "Chrome", "How to" ]
categories = [ "Debian" ]

[extra]
uuid = "uckstjz"
unsplashImgCoverId = "FnKKF2bATEE"
+++

## *Deprecated post!

Please go to [my new post](/a-very-short-ubuntu-debian-packages-installation-sheet-0967oym/)

<hr>

## สิ่งที่จำเป็นต่อการติดตั้ง
- ควรจะลง `Chromium` ก่อน เพราะว่าใน Chromium มี package ที่จำเป็นต่อการลง `Google Chrome` โดยใช้

    ```bash
    $ sudo aptitude install chromium
    ```

    >  **หมายเหตุ:** ความจริงจะลงเฉพาะ package ที่ Google Chrome ต้องการก็ได้ แต่จำไม่ได้แล้วว่ามันต้องการอะไรบ้าง เลยลงทั้ง Chromium เลย สะดวกดี

## ขั้นตอนการติดตั้ง
1. เริ่มจากจาก เพิ่ม repository ของ Google Chrome โดยที่เป็น [repository แบบไม่เป็นทางการ](https://wiki.debian.org/UnofficialRepositories)  แต่ก็สามารถเชื่อถือได้ระดับนึง เพราะว่าเป็น repository ที่แนะนำโดย Debian และเป็นของ Google

    > [repository](https://wiki.debian.org/DebianRepository) คือ แหล่งที่เก็บซอฟแวร์สำหรับ การติดตั้งใน linux ซึ่งสามารถค้นหาซอฟแวร์เพื่อที่จะติดตั้งได้

	สามารถทำได้ โดย เพิ่มประโยคว่า  `deb http://dl.google.com/linux/chrome/deb/ stable main` ลงในบรรทัดสุดท้ายของไฟล์นี้ `/etc/apt/source.list` สามารถทำได้โดยคำสั่งด้านล่างนี้ หรือวิธีอื่นๆ ตามที่ถนัดเลย

    ```bash
    $ sudo echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' >> /etc/apt/source.list
    $ sudo aptitude update
    ```

    >  **หมายเหตุ:** ที่ต้องใช้คำสั่ง `sudo aptitude update` หลังจากการเพิ่ม URL ของ repository ในไฟล์ `/etc/apt/source.list` แล้วเพราะว่า คำสั่ง `aptitude update` เป็น คำสั่งที่โหลดรายการซอฟแวร์ที่ใหม่ล่าสุดลงมาสำรองไว้บนเครื่องเรา เพื่อที่จะสามารถค้นหาและติดตั้งซอฟแวร์ได้ จึงทำให้เมื่อเพิ่ม [repository ของ Google Chrome](http://dl.google.com/linux/chrome/deb/) ลงไปแล้ว รายการซอฟแวร์ที่ใหม่ที่อัพเดทล่าสุดจะมี ซอฟแวร์ Google Chrome ปรากฏเพิ่มมาด้วย เราสามารถใช้คำสั่ง `$ sudo aptitude search google-chrome` ถ้าดำเนินการเสร็จแล้วจะขึ้นรายการซอฟแวร์มาเลือกให้เราติืดตั้ง

2. แต่ถ้าเกิดข้อผิดพลาดแบบนี้ หรือคล้ายๆ กับแบบนี้

    ```
    W: GPG error: http://dl.google.com stable Release: The following signatures couldn't be verified because the public key is not available: NO_PUBKEY A040830F7FAC5991
    ```

    มันหมายความว่า กุญแจ public key ของคุณนั้น (ในกรณี `A040830F7FAC5991` คือ public key ของผม) ไม่สามารถที่จะยืนยันได้
    ### วิธีแก้
    ให้ใช้คำสั่งต่อไปนี้ในการรับรอง repository จาก Google โดยที่ `[Your public KEY]` ให้ใส่ public key ของคุณ

    ```bash
    $ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys [Your public KEY]
    ```

3. โอเค ได้เวลาลง Google Chrome จริงๆล่ะ

    ```
    $ sudo aptitude update
    $ sudo aptitude install google-chrome-stable
    ```

> **หมายเหตุ:**: Google Chrome มีทั้งหมด 3 รุ่น คือ `google-chrome-beta`, `google-chrome-stable` และ `google-chrome-unstable` ก็คือ รุ่นทดลองใช้งาน(beta), รุ่นเสถียรแล้ว(stable) และ รุ่นไม่เสถียร(unstable) ตามลำดับ โดย รุ่นทดลองใช้งานกับรุ่นไม่เสถียร อาจจะมีบัค(ข้อผิดพลาด)บ้าง โดยเฉพาะในรุ่นไม่เสถียรจะมีมากสุด แต่ในขณะเดีัยวกันจะได้ความสามารถที่ใหม่กว่า ขึ้นอยู่กับความต้องการเลย เนื่องจากผมต้องใช้งานบ่อยเลยเลือกรุ่นเสถียรแทน (`google-chrome-stable`)

