+++
title = "วิธีการตั้งค่า Uptime Kuma บน Azure Virtual Machine"
date = "2023-08-18"

[taxonomies]
categories = [ "Azure" ]
tags = [ "Azure", "Uptime Kuma", "Docker", "Virtual Machine", "HTTPS" ]

[extra]
uuid = "h4uaaip"
+++

> หมายเหตุ บทความนี้ Draft ไว้ตั้งแต่วันที่ Dec 21, 2022 ถ้ามีเนื้อหาไหนที่ไม่ได้ Up-to-date ก็สามารถแจ้งได้เลยนะครับ

สวัสดีครับเพื่อนๆ ผู้อ่านทุกท่านที่กำลังมองหาวิธีการตั้งค่า Uptime Kuma บน Azure Virtual Machine ในบทความนี้เราจะมาแนะนำขั้นตอนการทำงานให้รู้เรื่องและเข้าใจง่ายๆ พร้อมกันนะครับ

เมื่อคุณพยายามติดตั้ง Uptime Kuma บน Azure App Service โดยใช้ Azure Files แล้ว
คุณอาจพบข้อผิดพลาดเช่นนี้ **[ดูรายละเอียดเพิ่มเติมที่ uptime-kuma#1096](https://github.com/louislam/uptime-kuma/issues/1096)**

```
vbnetCopy code
[Error: PRAGMA journal_mode = WAL - SQLITE_BUSY: database is locked]
```

เมื่อลองใช้งาน Azure App Service กับ Kuma Uptime จะพบว่า Kuma ต้องการ SQLite ในรูปแบบที่เป็น local
เท่าที่อ่านจาก [Official Doc "Mount Azure Storage as a local share in App Service"](https://learn.microsoft.com/en-us/azure/app-service/configure-connect-to-azure-storage?tabs=portal&pivots=container-linux)
> It isn't recommended to use storage mounts for local databases (such as SQLite) or for any other applications and components that rely on file handles and locks.

พบว่าเค้าไม่แนะนำให้เรา mount volume จำพวก local database เช่น SQLite หรือพวกแอพที่ต้องจัดการเรื่องไฟล์ หรือกลไกการ Lock

ดังนั้น สิ่งที่คุณควรทำคือใช้ Virtual Machine (VM) แทน
ในขั้นตอนถัดไปคือการติดตั้ง Docker บน Azure Virtual Machine
และคุณสามารถเพิ่ม Custom Domain ด้วย DNS A Record และ IP v4 ได้ตามขั้นตอนที่แนะนำไว้ในลิงก์นี้ [azure/virtual-machines/custom-domain](https://learn.microsoft.com/en-us/azure/virtual-machines/custom-domain)

เพื่อให้การเชื่อมต่อเป็น https คุณสามารถใช้ [Docker-compose และ **`https-portal`**](https://github.com/louislam/uptime-kuma/wiki/Reverse-Proxy#https-portal) ได้นะ

ตัวอย่างการตั้งค่า Docker Compose สำหรับ Uptime Kuma และ **`https-portal`** สามารถดูได้ดังนี้ครับ

```yml
version: '3.3'

services:
  https-portal:
    image: steveltn/https-portal:1
    ports:
      - '80:80'
      - '443:443'
    links:
      - uptime-kuma
    restart: always
    environment:
      DOMAINS: 'yourdomain.com -> http://uptime-kuma:3001'
      STAGE: 'production' # Don't use production until staging works
      # FORCE_RENEW: 'true'
      WEBSOCKET: 'true'
    volumes:
      - https-portal-data:/var/lib/https-portal

  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: uptime-kuma
    volumes:
      - ./uptime-kuma:/app/data
    ports:
      - 3001:3001
    restart: always

volumes:
  https-portal-data:
```

ถ้าคุณกำลังมองหาวิธีการตั้งค่า Uptime Kuma บน Azure Virtual Machine คุณสามารถทำตามขั้นตอนที่กล่าวมาได้อย่างง่ายดาย

ป.ล. สำนวนภาษาอาจจะแปลกๆ บ้างนะ เพราะใช้ ChatGPT ช่วยเรียบเรียงให้

## อ่านเพิ่มเติม

- [Using Azure File Shares as Container Volume Mounts in App Services](https://www.youtube.com/watch?v=q7J050yovuo)
- ถ้าคุณต้องการเพิ่มความสามารถให้เว็บไซต์ของคุณมีความเสถียรและพร้อมใช้งานเสมอ ก็สามารถใช้ Uptime Kuma พร้อมกับ Docker และ Traefik ได้ตามคำแนะนำในลิงก์นี้เลย **[Use Docker, Uptime Kuma, and Traefik To Monitor Your Website](https://levelup.gitconnected.com/use-docker-uptime-kuma-and-traefik-to-monitor-your-website-593373f9e0c2)** สำหรับบริการดีๆ แบบนี้
