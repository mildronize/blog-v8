+++
title = "ดึงไฟล์จาก Server มาที่เครื่องด้วยสิทธิ Root บน Ubuntu"
date = "2024-11-28"

[taxonomies]
categories = [ "Ubuntu" ]
tags = [ "Ubuntu", "SSH", "SCP", "Root", "Permissions" ]

[extra]
id = "yxrqebe"
+++

บางทีไฟล์ในเซิร์ฟเวอร์มันติดปัญหาเรื่อง **สิทธิ์ (permissions)** เพราะเป็นของผู้ใช้อื่น ทำให้เราใช้คำสั่ง **`scp`** ดึงไฟล์ออกมาไม่ได้ ถ้าเจอปัญหาแบบนี้ ลองทำตามวิธีนี้เลย ง่าย ๆ แค่ 2 ขั้นตอน!

---

### **1. เตรียมไฟล์ในเซิร์ฟเวอร์**

ก่อนอื่น ไปที่เซิร์ฟเวอร์แล้วก็อปไฟล์ที่ต้องการไปไว้ในตำแหน่งที่ผู้ใช้ปัจจุบันเข้าถึงได้ และปรับสิทธิ์ให้เหมาะสม ตัวอย่างคำสั่ง:

```bash
ssh -i ~/.ssh/ttss-poc/ttss-poc adminuser@ttss-dev.southeastasia.cloudapp.azure.com \
"sudo cp -r /home/ttssdev/.ssh /tmp/ssh-ttssdev && sudo chown -R adminuser:adminuser /tmp/ssh-ttssdev"
```

**คำอธิบายคำสั่งนี้แบบเข้าใจง่าย:**

- **`ssh`**: ใช้เชื่อมต่อไปที่เซิร์ฟเวอร์
- **`i`**: ระบุไฟล์คีย์ส่วนตัว (private key) เพื่อยืนยันตัวตน
- **`sudo cp -r`**: ก็อปไฟล์ที่ต้องการ (ในตัวอย่างคือ **`.ssh`**) ไปไว้ที่ตำแหน่งชั่วคราว **`/tmp/ssh-ttssdev`**
- **`sudo chown`**: เปลี่ยนเจ้าของไฟล์ให้เป็น **`adminuser`** เพื่อให้เราเข้าถึงได้

---

### **2. ดึงไฟล์กลับมาที่เครื่อง**

เมื่อไฟล์พร้อมแล้ว ใช้คำสั่ง **`scp`** ดึงกลับมาที่เครื่องเราได้เลย:

```bash
scp -i ~/.ssh/ttss-poc/ttss-poc -r adminuser@ttss-dev.southeastasia.cloudapp.azure.com:/tmp/ssh-ttssdev ~/ssh-ttssdev
```

**คำอธิบายคำสั่ง:**

- **`scp`**: ใช้สำหรับโอนถ่ายไฟล์แบบปลอดภัย
- **`r`**: ดึงโฟลเดอร์ทั้งโฟลเดอร์ (recursive)
- **`adminuser@...:/tmp/ssh-ttssdev`**: ระบุตำแหน่งไฟล์ในเซิร์ฟเวอร์
- **`~/ssh-ttssdev`**: ระบุที่เก็บไฟล์ในเครื่องเรา

---

## **ทำเป็น Bash Script ใช้ซ้ำได้ง่าย ๆ**

ถ้าไม่อยากมาพิมพ์คำสั่งยาว ๆ ทุกครั้ง ลองเขียนเป็น **Bash Script** แบบนี้:

```bash
#!/bin/bash

# ตั้งค่าตัวแปร
REMOTE_USER="adminuser"
REMOTE_HOST="ttss-dev.southeastasia.cloudapp.azure.com"
REMOTE_PATH="/home/ttssdev/.ssh"
TMP_PATH="/tmp/ssh-ttssdev"
LOCAL_PATH="$HOME/ssh-ttssdev"
SSH_KEY="$HOME/.ssh/ttss-poc/ttss-poc"

# 1. ก็อปไฟล์ไปยังตำแหน่งที่เข้าถึงได้
echo "Preparing files on remote server..."
ssh -i "$SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" \
"sudo cp -r $REMOTE_PATH $TMP_PATH && sudo chown -R $REMOTE_USER:$REMOTE_USER $TMP_PATH"

# 2. ดึงไฟล์กลับมาที่เครื่อง
echo "Copying files to local machine..."
scp -i "$SSH_KEY" -r "$REMOTE_USER@$REMOTE_HOST:$TMP_PATH" "$LOCAL_PATH"

echo "Files copied successfully to $LOCAL_PATH!"
```

**วิธีใช้งาน:**

1. สร้างไฟล์สคริปต์ เช่น **`fetch_files.sh`** แล้ววางโค้ดด้านบนลงไป
2. ให้สิทธิ์รันไฟล์:
    
    ```bash
    chmod +x fetch_files.sh
    ```
    
3. รันสคริปต์ได้เลย:
    
    ```bash
    ./fetch_files.sh
    ```

## สรุป   
การดึงไฟล์จากเซิร์ฟเวอร์ที่มีปัญหาเรื่องสิทธิ์เป็นงานที่ดูซับซ้อน แต่สามารถแก้ไขได้ง่าย ๆ ด้วยการเตรียมไฟล์ให้เข้าถึงได้บนเซิร์ฟเวอร์ และใช้คำสั่ง scp ดึงไฟล์กลับมาที่เครื่องของเรา ขั้นตอนนี้ปลอดภัยและไม่กระทบไฟล์ต้นฉบับโดยตรง นอกจากนี้ การเขียน Bash Script ยังช่วยให้กระบวนการนี้สะดวกและนำกลับมาใช้ซ้ำได้อย่างรวดเร็ว หากทำตามวิธีที่แนะนำในบทความนี้ คุณจะสามารถจัดการไฟล์ที่มีปัญหาเรื่องสิทธิ์ได้อย่างมืออาชีพและมีประสิทธิภาพ! 🚀ง

จบปิ้งง