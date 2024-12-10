+++
title = "เปิด Hotspot WiFi เองโดยที่ต้องไม่พึ่งโปรแกรมใดๆ บน Windows"
description = "อธิบายการใช้งาน script สำหรับสร้าง WiFi Hotspot ใช้งานเองโดยไม่ต้องพึ่งโปรแกรมอื่นๆ"
date = "2016-06-04"

[taxonomies]
tags = [ "Hotspot", "Wifi", "Windows" ]
categories = [ "Hotspot" ]

[extra]
id = "4hztzdg"
unsplashImgCoverId = "sNvBTRQR7eE"
+++

โปรแกรมทางเลือกสำหรับการสร้าง WiFi Hotspot ใช้งานเองโดยไม่ต้องพึงโปรแกรมอื่นๆ จากคอมพิวเตอร์ของคุณ เช่น [Connectify](http://www.connectify.me/) หรือ [mHotspot](http://www.mhotspot.com/) เป็นต้น

โดยทำการทดสอบบน Windows 7,8, 10 แล้วใช้งานได้

## ตั้งค่าเบื้องต้นก่อนใช้งาน
1. คัดลอกโค๊ดข้างล่าง หรือ ดาวโหลดที่ [Gist Github ของผม](https://gist.github.com/mildronize/8d159d35497c56368914) ไปใส่ในไฟล์ ชื่อ `hotspot.bat`
1. ตรวจสอบดูว่า มี Network Adapter ที่มีชนิดเป็น *Microsoft Virtual WiFi Miniport Adapter* ใน *Network and Sharing Center > Change Adapter Setting*
  - ถ้าไม่มีให้รัน `hotspot.bat` หนึ่งครั้ง มันจะสร้าง Adapter ตัวนั้นออกมา และปิดโปรแกรมไปก่อน แล้วก็เปลี่ยนชื่อเป็น `Hotspot`
  - ถ้ามีก็ให้เปลี่ยนชื่อเป็น `Hotspot` เช่นกัน
  >  ไม่เปลี่ยนชื่อเป็น Hotspot แต่ต้องไปแก้ในโค๊ด ตรงบรรทัดที่ `set wirelessName=Hotspot` ให้แก้เป็นชื่อของ adapter ที่มีชนิดเป็น *Microsoft Virtual WiFi Miniport Adapter*

1. สั่งแชร์อินเตอร์เน็ตจากสายแลน (Ethernet) ไปยัง Hotspot โดย
  1. คลิกขวา Ethernet Adapter ใน *Network and Sharing Center > Change Adapter Setting*
  1. เลือก Properties และไปกดที่แท็บ Sharing
  1. ติ๊กถูกที่ **Allow other network users to connect through this computer’s Internet connection**
  1. จากนั้นเลือกชื่อของ Hotspot ที่เราตั้งไว้จากข้อ 2 ในที่นี่คือ `Hotspot`
1. เริ่มทำงานโดยรัน `hotspot.bat` หรือ `hotspot` หรือผ่าน command line
  1. ตั้งค่าชื่อ Hotspot ( *What is Adhoc name ?* )
  1. ใส่รหัสผ่าน ( *Password ?* )

## CLI
```bash
hospot # ตั้งค่า ชื่อ Wifi และรหัสผ่าน ใหม่
hospot start # เปิด Hotspot
hospot stop # ปิด Hotspot
hospot restart # ปิดแล้วเปิดใหม่อีกครั้ง
```

## โค๊ดการโปรแกรมเปิด Hotspot บน Windows
<https://gist.github.com/mildronize/8d159d35497c56368914>

```batch
@ECHO OFF
echo Hotspot
echo .

set wirelessName=Hotspot

IF "%1"=="start" goto START
IF "%1"=="stop" goto STOP
IF "%1"=="restart" goto RESTART
IF "%1"=="stat" goto STAT

set /p name=What is Adhoc name ? (Press S to stop):


IF "%name%"=="S" goto STOP
IF "%name%"=="" goto START

:SET
echo Start adhoc!
set /p pass=Password ? :
netsh wlan set hostednetwork mode=allow ssid="%name%" key=%pass%
netsh wlan start hostednetwork
netsh interface ip set address name="%wirelessName%" source=dhcp
goto EXIT

:START
echo Starting hotspot!
netsh wlan start hostednetwork
goto EXIT


:STOP
echo Stopping hotspot!
netsh wlan stop hostednetwork
goto EXIT

:RESTART
echo Restarting hotspot!
netsh wlan stop hostednetwork
netsh wlan start hostednetwork
goto EXIT

:STAT
netsh wlan show hostednetwork
goto EXIT

:EXIT
pause
```
