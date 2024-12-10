+++
title = "การเดินทางของ Xiaomi Mi2s และแนวทางแก้ปัญหาเซนเซอร์แนบหู (Proximity Sensor) ไม่ทำงาน"
date = "2017-01-29"

[taxonomies]
categories = [ "Mi2s" ]
tags = [ "Mi2s", "Xposed", "Proximity Sensor" ]

[extra]
id = "92rs1lc"
unsplashImgCoverId = "uIF40JqldaI"
+++

ผมซื้อเจ้า [Xiaomi Mi2s](http://www.gsmarena.com/xiaomi_mi_2s-5397.php) เมื่อวันที่ 11 กรกฎาคม 2556 ถ้านับเวลาจากวันนั้นถึงวันนี้ก็รวมๆ แล้ว 3 ปีครึ่งที่อยู่บนมือผม มือถือเครื่องนี้เป็นมือถือเครื่องที่ 3 ในชีวิตผมล่ะ เครื่องแรกก็ [Sony Ericsson W200i](http://www.gsmarena.com/sony_ericsson_w200-1824.php) ในสมัยนั้นยังไม่มี smart phone อะไรเลย กว่าราคามือถือที่สามารถฟังเพลงได้ ถ่ายรูปได้ ราคาจะลงมาในระดับที่เด็กนักเรียนคนนึงสามารถเก็บเงินซื้อได้ ตอนนั้นซื้อราคา 4 พันกว่าๆ

เครื่องที่สองคือ [Motorola Defy](http://www.gsmarena.com/motorola_defy-3514.php) เป็น smart phone เครื่องแรกๆ ที่สามารถกันน้ำได้ ตอนนั้นเพิ่งเข้าไทยใหม่ๆ ผมเลยซื้อมาเลย เครื่องนี้นับว่าผ่านร้อน ผ่านหนาวมาเยอะเหมือนกัน เปลี่ยนแบตเตอร์รี่ไป 1 รอบ เปลี่ยนหน้าจอสัมผัสไปแล้วน่าจะสัก 4-5 รอบได้ สั่งมาเปลี่ยนเอง จนแทบหาอะไหล่แทบไม่ได้ ผนวกกับ ROM แทบจะอัพเกรดไปต่อไปไม่ไหวแล้ว ตอนที่ซื้อมาเป็น Android 2.1 อัพเกรดโดยใช้ Custom ROM (สมัยนั้นก็มี [MIUI](http://en.miui.com/) 3, [CyanogenMod](https://en.wikipedia.org/wiki/CyanogenMod) 7) มาเรื่อยๆจนถึง Android 4.0 ก็มาจบที่ CyanogenMod 7 ในที่สุดก็ได้วางเครื่องนั้นไปแล้วไปซื้อเจ้า Xiaomi Mi2s

เครื่องต่อไปก็ Xiaomi Mi2s เนี่ยแหละ เครื่องประวัติก็ไม่ธรรมดา

- เปลี่ยนแบตเตอร์รี่ไป 2 รอบแล้ว
- เปลี่ยนหน้าจอสัมผัสไปแล้ว 2 รอบ
- ส่งซ่อมเฉพาะรูสำหรับชาร์จไฟ (Micro usb) เพราะว่าของเดิมมันหลวมจนเสียบสายชาร์จไม่ได้

ปัญหาคือ รอบแรกที่เปลี่ยนหน้าจอสัมผัสกับร้านรับซ่อมมือถือร้านหนึ่งใน กทม. แต่พอเอามาใช้งานกลับปรากฏว่า Proximity Sensor พัง (เซนเซอร์ที่มีหน้าที่ตรวจจับการแนบหู เวลาโทรถ้าแนบหูแล้ว หน้าจอจะดับ) ใช้งานไม่ได้

ปัญหาเวลาใช้งานโทรศัพทคือ เวลาโทรจอดับตลอดเวลา คือเซนเซอร์เข้าใจว่า มือถือแนบหูตลอดเวลา เลยทำให้วางสายหรือสัมผัสหน้าจออะไรไม่ได้จนกระทั่งอีกฝั่งต้องวางสายก่อน ซึ่งก็ลำบากเลยทีเดียว

ตอนแรกแก้ปัญหาโดยใข้ Feature ปิดเซนเซอร์ Proximity Sensor ของแอพ Phone ของรอม MIUI ปัญหาคือ ถ้าเราโทรผ่านแอพ Line หรือ Messenger ก็ยังคงมีปัญหาเดิมอยู่ ผนวกกับมือถือเก่าละ รอมที่ใช้อยู่ เป็น MIUI 8 มันทำงานช้าลง เลยตัดสินใจเปลี่ยนเป็นรอม CyanogenMod 12.1 (Android 5.1) เลยต้องใช้ตัวช่วยอย่าง [Sensor Disabler](http://repo.xposed.info/module/com.mrchandler.disableprox) ซึ่งจำเป็นต้องติดตั้ง [Xposed Framework](http://repo.xposed.info/module/de.robv.android.xposed.installer) เพื่อที่จะปิดการทำงานของ Proximity Sensor และเครื่องนั้นจะต้อง root ด้วย

## สรุปเป็นขั้นตอนดังนี้

**ติดตั้ง Custom ROM**

1. ติดตั้ง Custom Recovery ในที่นี้ผมใช้ [TWRP](https://twrp.me/) [ลิงค์สำหรับ Mi2s](http://en.miui.com/thread-190608-1-1.html)
2. ติดตั้ง CyanogenMod 12.1 ผ่าน TWRP Recovery ซึ่งผมใช้[ไฟล์นี้](http://en.miui.com/thread-140138-1-1.html)
3. ติดตั้ง Google App โดยดาวโหลดจาก [OpenGapps.org](http://opengapps.org/)
4. ถ้ามีปัญหาไม่สามารถเปิดกล้องได้ ลองติดตั้ง[ตัวแก้](https://forum.xda-developers.com/galaxy-s3/themes-apps/17-fixed-camera-app-lib-cm-aosp-roms-t2505973) โดยติดตั้งผ่าน TWRP Recovery เช่นกัน

**Root เครื่อง**

1. ติดตั้ง Supersu ผ่าน TWRP Recovery โดยดาวโหลดจาก [Chainfire.eu](https://download.chainfire.eu/696/supersu/)

**ติดตั้ง Xposed Framework**

1. ติดตั้ง Xposed Framework โดยวิธีติดตั้งดูจากเว็บ [Xposed Offical XDA forum](https://forum.xda-developers.com/showthread.php?t=3034811) ซึ่งสำหรับ Lollipop/Marshmallow เท่านั้น

**ปิดการทำงานของ Proximity Sensor**

1. ติดตั้ง [Sensor Disabler](http://repo.xposed.info/module/com.mrchandler.disableprox) ผ่านทางแอพ Xposed installer ที่ลงจากขั้นตอนที่แล้ว จากนั้น มี enable module นี้แล้วให้ Restart เครื่องหนึ่งครั้งถึงจะใช้งานได้
2. เข้าแอพ Sensor Disabler จากนั้นไปเลือก Proximity Sensor จากเมนูเลือกค่าเป็น 5 นั่นคือบังคับค่าให้เซนเซอร์ตรวจว่า ไม่ได้แนบหูอยู่ตลอดเวลานั้นเอง

ก็เสร็จสิ้นไว้เพียงเท่านี้ รายละเอียดขั้นตอนการทำงานมันเยอะ ถ้าอยากสอบถามขั้นตอนไหน ทิ้งข้อความในคอนเม้นต์ด้านล่างได้เลยครับ
