+++
title = "วิธีตั้งค่าการใช้งาน Github (แบบไม่ต้องกรอกรหัสผ่านทุกครั้ง) ผ่าน SSH บน Windows"
date = "2018-08-28"

[taxonomies]
tags = [ "How to", "GitHub", "Windows", "Putty" ]
categories = [ "How to" ]

[extra]
image = "https://www.dropbox.com/s/6j7n98dlmnubjxq/cover.jpg?raw=1"
id = "mo4feik"
unsplashImgCoverId = "z0uPpx6DDcA"
+++

ขั้นตอนการตั้งค่าการใช้งาน Github  แบบไม่ต้องกรอกรหัสผ่านทุกครั้ง บน windows

จริงๆ แล้ว ก็ใช้ git มานานแต่บางครั้งก็ขีเกียจตั้งค่า โดยเฉพาะบน Windows มันมีหลายวิธีมาก แต่ผมถนัดวิธีนี้ทุกสุดและยุ่งยากน้อยสุดแล้ว (เขียนไม่ค่อยละเอียดเท่าไหร่ เหมาะสำหรับคนที่คุ้นชินกับ Putty อยู่แล้ว)

1. [ดาวโหลด](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) และติดตั้ง Putty ไว้ในเครื่องก่อนเลย แนะนำให้ลงแบบ `MSI (‘Windows Installer’)`เพราะมันจะมีโปรแกรมเพื่อนบ้านมาให้ด้วย ในโพสนี้จะใช้ `puTTYgen` และ `plink` หรือใครจะลงแยกก็ได้
2. ตั้งค่า system environment variable ให้เรียบร้อย ถ้าลงผ่าน installer น่าจะตั้งค่าไว้แล้ว
3. สร้าง Private Key และ Public Key จาก `puTTYgen` โดยเลือกเป็น RSA 2048 (ใครจะเลือกตัวอื่นก็ได้นะ เผื่อตัวที่ดีกว่านี้ในอนาคต) กด generate แล้วก็เอา mouse เป็นวนๆ ที่ว่างๆ จนแถบโหลดเต็ม แล้วก็ตั้งค่ารหัสผ่าน (key passphrase) จะใส่ตรงที่มีการใช้ key นี้ทุกครั้ง (จะไม่ตั้งก็ได้นะ จะได้ตามชื่อบล็อกพอดี) ![1](https://www.dropbox.com/s/7d1cqu99b93pv1w/1.png?raw=1)
4. จากนั้นก็อปปี้ public key จาก `puTTYgen` ตัวเดิมไปใส่ใน[หน้า SSH ของการตั้งค่า github ของเรา https://github.com/settings/keys ![2](https://www.dropbox.com/s/pxikmsgglo273yf/2.PNG?raw=1)
5. ตั้งค่า environment variable `GIT_SSH` ให้เป็น path ไปยัง `plink` เช่น

    ```
    SET GIT_SSH=C:\path\to\PuTTY\plink.exe
    ```

6. เพิ่ม SSH key ลงไปในโปรแกรม `Pageant`

    ```
    C:\path\to\PuTTY\pageant.exe c:\pathtoprivate-ssh-key.ppk`
    ```

7. ตรวจสอบการเชื่อมต่อ เป็นอันเสร็จ

    ```
    plink -v git@github.com
    ```

ถ้าได้ผลลัพธ์ประมาณนี้ถือว่าผ่านแล้วครับ

```
Hi mildronize! You've successfully authenticated, but GitHub does not provide shell access.
Server sent command exit status 1
Disconnected: All channels closed
```



### ขอบคุณแหล่งที่มาดีๆ ครับ

- [Git and Putty on Windows in command line](https://www.richardkotze.com/top-tips/git-on-windows-in-command-line)
- [Windows git SSH authentication to GitHub](https://vladmihalcea.com/tutorials/git/windows-git-ssh-authentication-to-github/)

## ของแถม

หลายๆ คนอาจจะเข้าไปที่ git directory บนเครื่องเราแล้ว ก็ยังต้องใส่ username และ password เหมือนเดิมอยู่อีก อย่าลืมเปลี่ยน remote URL จาก HTTPS เป็น SSH นะครับ เช่น

ถ้าดูที่ github URL เราจะเห็นหน้าตาประมาณนี้ `https://github.com/USERNAME/REPOSITORY`

เช่นถ้าเรา username: `mildronize` และ github repo คือ `mildronize.github.io`

ดังนั้น URL จะมีหน้าตาประมาณนี้ `https://github.com/mildronize/mildronize.github.io`

เราอาจจะ clone ด้วย HTTPS มา สังเกตุคือที่ URL จะขึ้นต้นด้วย HTTPS เช่น

```bash
git clone https://github.com/mildronize/mildronize.github.io
```

แต่ถ้าเรา clone ด้วย SSH สังเกตุที่ URL จะขึ้นต้นด้วย `git@github.com` มาหน้าตาจะประมาณนี้

```bash
git clone git@github.com:mildronize/mildronize.github.io.git
```

เข้าเรื่องกันเลย ไปดูขั้นตอนการเปลียนจาก remote URL จาก HTTPS เป็น SSH

### การเปลี่ยนไปใช้ remote URLs SSH จาก HTTPS

1. `cd` ไปที่ git directory ของเราก่อนนะ
2. ให้ใช้ `git remote -v` เพือดูว่าตอนนี้ directory นี้ชี้ไปที่ไหน

    ```
    git remote -v
    origin  https://github.com/USERNAME/REPOSITORY.git (fetch)
    origin  https://github.com/USERNAME/REPOSITORY.git (push)
    ```

3. เปลียนจาก remote URL จาก HTTPS เป็น SSH  `git remote set-url` command.

    ```
    git remote set-url origin git@github.com:USERNAME/REPOSITORY.git
    ```

4. Verify that the remote URL has changed.

    ```
    git remote -v
    # Verify new remote URL
    origin  git@github.com:USERNAME/REPOSITORY.git (fetch)
    origin  git@github.com:USERNAME/REPOSITORY.git (push)
    ```

### ขอบคุณข้อมูลจาก
- https://help.github.com/articles/changing-a-remote-s-url/

เป็นไงบ้างครับ ไม่ยากเลยใช่มั้ยครับ จริงๆ เขียนให้ตัวเองอ่านด้วย ไว้พบกันใหม่ สวัสดีครับ
