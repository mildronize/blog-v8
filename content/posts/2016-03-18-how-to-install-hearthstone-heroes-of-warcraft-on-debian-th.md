+++
title = "วิธีติดตั้งเกม Hearthstone: Heroes of Warcraft บน Debian"
description = "อธิบายขั้นตอนการลงเกม Hearthstone: Heroes of Warcraft ผ่านโปรแกรม wine พร้อมวิธีแก้ปัญหา"
date = "2016-03-18"

[taxonomies]
categories = [ "Hearthstone" ]
tags = [ "Hearthstone", "Debian", "How to", "Wine" ]

[extra]
featured_image = "logo/hearthstone.jpg"
id = "2vpnolt"
unsplashImgCoverId = "22W93iChREU"
+++

ผมได้โอกาสลองเล่น Hearthstone: Heroes of Warcraft ดู ปรากฏว่าสนุกมากๆ เลยครับ ทำออกมาดีเลยที่เดียว แถมมีทุก platform เลย ยกเว้น Linux แอบน้อยใจนิดๆ เลยได้ลองหาวิธีติดตั้งดู ซึ่งก็ไม่ได้ยากอย่างที่คิด ถ้าใครเป็นมือใหม่ลองทำตามขั้นตอนนี้เลยนะครับ

> Note: ผมทดสอบบน Debian sid สถาปัตยกรรมแบบ amd64 นะครับ ดังนั้นปัญหาอาจจะไม่เหมือนซะทีเดียว แต่ก็พอนำมาอ้างอิงได้ครับ

## ขั้นตอน
1. ทำเพิ่มสถาปัตยกรรมของคลังเก็บโค๊ด (repository) สำหรับการติดตั้งแพคเก็ต 32 bit หรือ i386 แล้วสั่งอัพเดทรายการของคลังเก็บโค๊ด (repository) เนื่องจากการติดตั้ง Hearthstone จำเป็นใช้โค๊ดบางอย่างแบบ i386 ดังนี้

    > อ่านก่อน: ถ้าใครที่ใช้ Debian 32 bit (i386) อยู่แล้วให้ข้ามขั้นตอนนี้ไปได้เลยครับ ขั้นตอนนี้สำหรับ Debian 64 bit(amd64) นะครับ

    ```
    # dpkg --add-architecture i386
    # aptitude update
    ```

1. อันดับแรก ติดตั้ง `wine` ซึ่งเป็นโปรแกรมบน Linux สำหรับทำให้โปรแกรมบน Windows สามารถทำงานบน Linux ได้ครับ

    ```
    # aptitude install wine
    ```

1. ทำการสำรองข้อมูลของ `wine` ก่อน ถ้ามี

    ```
    $ mv ~/.wine ~/.wine-old
    ```

1. สร้างสภาพแวดล้อมแบบ 32 bit หรือ i386 โดย

    ```
    $ env WINEARCH=win32 WINEPREFIX=$HOME/.wine wineboot -u
    ```

1. กำหนดไลบรารี่ที่จำเป็นเพิ่มเติม โดยมี `dbghelp` และ `msvcp100` โดยการ

    1. สั่งให้คำสั่ง `winecfg` เพื่อทำการตั้งค่า
    1. ในแท็บของไลบรารี่ (Libraries) นั้นให้กด สร้าง `dbghelp` แล้วทำการแก้ไขเป็น `disabled`
    1. ในแท็บของไลบรารี่ (Libraries) นั้นให้กด สร้าง `msvcp100` แล้วทำการแก้ไขเป็น `native, then builtin`
    1. **สุดท้ายต้องมั่นใจว่า** ตั้งค่าสภาพแวดล้อมเป็น `Windows XP` แล้ว ไม่อย่างนั้น จะเจออาการจอขาวเวลาเข้าเกม

1. ดาวโหลดจากหน้าเว็บได้[ที่นี่](http://eu.battle.net/hearthstone/en/)
1. จากนั้นให้กดติดตั้งเกม hearthstone
1. สุดท้ายขอให้สนุกกับการเล่นเกม Hearthstone นะครับ

## แหล่งข้อมูลเพิ่มเติม และอ้างอิง
- [ขั้นตอนการติดตั้งแบบวิดิโอผ่าน Youtube เป็นภาษาอังกฤษ](https://www.youtube.com/watch?v=WZyEu2OrgzU)
- [ผลการทดสอบของผู้เล่นคนอื่นๆ โดยติดตั้ง Hearthstone ผ่าน wine รวมถึงวิธีการแก้ปัญหา เวลาเจอบัคต่างๆ](https://appdb.winehq.org/objectManager.php?sClass=version&iId=30038)
