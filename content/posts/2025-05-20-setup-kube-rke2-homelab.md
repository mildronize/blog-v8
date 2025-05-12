+++
title = "Setup Kube RKE2 Homelab"
date = "2025-05-20"
draft = true

[taxonomies]
categories = [ "Kubernetes" ]
tags = [ "Kubernetes", "ubuntu" ]
+++

```
$ lsb_release -a

No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 24.04.2 LTS
Release:        24.04
Codename:       noble

$ uname -a
Linux XXXX 6.8.0-59-generic #61-Ubuntu SMP PREEMPT_DYNAMIC Fri Apr 11 23:16:11 UTC 2025 x86_64 x86_64 x86_64 GNU/Linux
```

อันนี้หลังติดตั้ง Ubuntu Server 2024 ใช้แบบ LVM มา

```
$ lsblk
NAME                      MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda                         8:0    0   1.8T  0 disk 
├─sda1                      8:1    0    16M  0 part 
├─sda2                      8:2    0 886.4G  0 part 
└─sda3                      8:3    0 976.6G  0 part 
nvme0n1                   259:0    0 931.5G  0 disk 
├─nvme0n1p1               259:1    0     1G  0 part /boot/efi
├─nvme0n1p2               259:2    0     2G  0 part /boot
└─nvme0n1p3               259:3    0 928.5G  0 part 
  └─ubuntu--vg-ubuntu--lv 252:0    0   100G  0 lvm  /
```


## Plan: หัวข้อ: แผนการจัดการ Disk / Volume สำหรับ Kubernetes แบบ Production-Friendly (ไม่ผูก Distro)


## 🧭 โครงสร้างแผน Disk/Volume

### 🔹 1. **SSD (nvme0n1)**

**→ ใช้สำหรับ system, fast storage, และ volume ที่ต้อง IOPS สูง**

| พื้นที่     | Mountpoint       | ใช้ทำอะไร                                  | Use Case                        |
| ------- | ---------------- | ---------------------------------------- | ------------------------------- |
| 100GB   | `/` (root)       | OS Ubuntu, system base                   | ทุกอย่างนอก K8s                   |
| 100GB   | `/var/lib`       | เก็บ state K8s: containerd, etcd, kubelet | Core ของ cluster                |
| 200GB   | `/opt/kube-data` | เก็บ volume ที่เร็ว, log, DB                 | PostgreSQL, Redis, app PVC      |
| \~528GB | **ยังไม่จัดสรร**    | ขยาย PV เพิ่ม, หรือลอง LVM snapshot         | อนาคต: CSI/Longhorn, Dev volume |

---

### 🔸 2. **HDD (sda2 / sda3)**

**→ พื้นที่เยอะ ไม่เร็ว แต่ดีสำหรับ backup, archive, low-priority data**

| พื้นที่     | Mountpoint                     | ใช้ทำอะไร                      | Use Case                     |
| ------- | ------------------------------ | ---------------------------- | ---------------------------- |
| \~886GB | `/mnt/storage-hdd`             | สำรอง volume, snapshot, rsync | Backup DB, Archive Logs      |
| \~976GB | `/mnt/storage-hdd2` (optional) | ใช้เป็น cold storage สำรอง      | สำรอง metadata, media, report |

---

## 🧠 แผน Logical Volume (LVM)

ถ้ามายใช้ LVM (ตามที่ใช้กับ `/` อยู่แล้ว):

| LV Name    | Mountpoint        | Volume Group        | Use Case                    |
| ---------- | ----------------- | ------------------- | --------------------------- |
| `root`     | `/`               | `ubuntu-vg`         | System OS                   |
| `varlib`   | `/var/lib`        | `ubuntu-vg`         | K8s core state              |
| `kubedata` | `/opt/kube-data`  | `ubuntu-vg`         | Fast PVC / DB Volume        |
| (future)   | `/data/<project>` | `ubuntu-vg` หรือ HDD | Dev/Backup volume as needed |

---

## 📚 Use Case สำหรับแต่ละส่วน

| Use Case                    | Path/Volume                | Storage Type   |
| --------------------------- | -------------------------- | -------------- |
| etcd, containerd, manifests | `/var/lib/...`             | SSD (varlib)   |
| PostgreSQL DB volume        | `/opt/kube-data/postgres`  | SSD (kubedata) |
| Redis, MongoDB              | `/opt/kube-data/redis`     | SSD            |
| Media uploads (ภาพ/ไฟล์)     | `/mnt/storage-hdd/uploads` | HDD            |
| Backup/rsync snapshot       | `/mnt/storage-hdd/backup`  | HDD            |
| Pod logs/archive            | `/mnt/storage-hdd/logs`    | HDD            |

---

## 📦 Bonus แนวทางติด Volume ใน K8s

```yaml
volumeMounts:
  - name: pgdata
    mountPath: /var/lib/postgresql/data

volumes:
  - name: pgdata
    hostPath:
      path: /opt/kube-data/postgres
```

หรือใช้ PVC:

```yaml
storageClassName: local-path
accessModes:
  - ReadWriteOnce
resources:
  requests:
    storage: 10Gi
```

---

## 🧼 หลักการออกแบบ:

* แยก Disk ตามประเภทงาน: "เร็ว vs ใหญ่"
* ไม่ผูกกับ Distro (ไม่ตั้งชื่อ `rancher`, `k3s`, `kubeadm`)
* ทุก path เป็นของเราเอง → ควบคุมง่าย, ย้ายง่าย
* พร้อม scale ไปใช้ CSI หรือ Cloud storage ได้ภายหลัง

## Act: หัวข้อ: แผนการจัดการ Disk / Volume สำหรับ Kubernetes แบบ Production-Friendly (ไม่ผูก Distro)

```bash
# ตรวจชื่อ Volume Group ปัจจุบัน
$ sudo vgdisplay

  --- Volume group ---
  VG Name               ubuntu-vg
  System ID             
  Format                lvm2
  Metadata Areas        1
  Metadata Sequence No  2
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                1
  Open LV               1
  Max PV                0
  Cur PV                1
  Act PV                1
  VG Size               928.46 GiB
  PE Size               4.00 MiB
  Total PE              237685
  Alloc PE / Size       25600 / 100.00 GiB
  Free  PE / Size       212085 / 828.46 GiB
  VG UUID               lc8xFx-Cmdc-YmpG-1CeY-U7V7-pdLI-mgOOHQ
```

แปลว่า 

| รายการ       | ค่า                   |
| ------------ | -------------------- |
| ขนาดรวม      | \~928GB              |
| ใช้แล้ว        | 100GB (LV: root)     |
| เหลือว่าง      | \~828GB (212,085 PE) |
| Format       | `lvm2` (resizable ✅) |
| สร้าง LV ได้อีก | สบายมากกกก 🎉         |

### จะสร้าง Logical Volume ใหม่ 

```bash
# สำหรับ K8s core state (varlib)
sudo lvcreate -n varlib -L 100G ubuntu-vg

# สำหรับ fast volume เช่น PostgreSQL, Redis, PVC ต่าง ๆ
sudo lvcreate -n kubedata -L 200G ubuntu-vg
```

ตอนนี้มี 3 LV แล้ว: root, varlib, kubedata

### ต่อจากนั้น format และ mount

```bash
# Format
sudo mkfs.ext4 /dev/ubuntu-vg/varlib
sudo mkfs.ext4 /dev/ubuntu-vg/kubedata

# สร้าง Directory สำหรับ mount
sudo mkdir -p /mnt/varlib /opt/kube-data

# Mount เพื่อย้ายของเดิมออกก่อน (สำคัญสำหรับ /var/lib) - เตรียม backup ก่อน
sudo mount /dev/ubuntu-vg/varlib /mnt/varlib

# ย้ายของเดิมใน /var/lib ไปเก็บ
sudo cp -a /var/lib/* /mnt/varlib/
sudo mv /var/lib /var/lib.bak
sudo mkdir /var/lib
sudo mount /dev/ubuntu-vg/varlib /var/lib 

# ✅ ย้ายข้อมูลที่เราก๊อปไว้ที่ /mnt/varlib กลับมาที่ /var/lib ใหม่ (บน SSD จริง)
# sudo cp -a /mnt/varlib/* /var/lib/
```

🔹 3. เพิ่มใน /etc/fstab
```bash
echo '/dev/ubuntu-vg/varlib /var/lib ext4 defaults 0 2' | sudo tee -a /etc/fstab
echo '/dev/ubuntu-vg/kubedata /opt/kube-data ext4 defaults 0 2' | sudo tee -a /etc/fstab
```

เคลียร์ของเก่าออก (Optional)
```bash
sudo rm -rf /var/lib.bak
```

### ตรวจสอบการ mount
```bash
$ mount | grep /var/lib
/dev/mapper/ubuntu--vg-varlib on /var/lib type ext4 (rw,relatime)
```

พร้อมใช้งานแล้ว!


🔸 [B] เตรียมพื้นที่ Backup บน HDD
```bash
sudo mkfs.ext4 /dev/sda2
sudo mkdir -p /mnt/storage-hdd
sudo mount /dev/sda2 /mnt/storage-hdd
echo '/dev/sda2 /mnt/storage-hdd ext4 defaults 0 2' | sudo tee -a /etc/fstab
```

## เช็คของหลังจาก Mount

```bash
$ mount | grep -E '^/dev|^UUID'
/dev/mapper/ubuntu--vg-ubuntu--lv on / type ext4 (rw,relatime)
/dev/nvme0n1p2 on /boot type ext4 (rw,relatime)
/dev/nvme0n1p1 on /boot/efi type vfat (rw,relatime,fmask=0022,dmask=0022,codepage=437,iocharset=iso8859-1,shortname=mixed,errors=remount-ro)
/dev/mapper/ubuntu--vg-varlib on /mnt/varlib type ext4 (rw,relatime)
/dev/mapper/ubuntu--vg-varlib on /var/lib type ext4 (rw,relatime)
/dev/mapper/ubuntu--vg-kubedata on /opt/kube-data type ext4 (rw,relatime)
/dev/sda2 on /mnt/storage-hdd type ext4 (rw,relatime)

$ findmnt -t ext4
TARGET             SOURCE                            FSTYPE OPTIONS
/                  /dev/mapper/ubuntu--vg-ubuntu--lv ext4   rw,relatime
├─/boot            /dev/nvme0n1p2                    ext4   rw,relatime
├─/mnt/varlib      /dev/mapper/ubuntu--vg-varlib     ext4   rw,relatime
├─/mnt/storage-hdd /dev/sda2                         ext4   rw,relatime
├─/var/lib         /dev/mapper/ubuntu--vg-varlib     ext4   rw,relatime
└─/opt/kube-data   /dev/mapper/ubuntu--vg-kubedata   ext4   rw,relatime
```

###  ดู LVM Logical Volume ทั้งหมด (ชื่อ, ขนาด, mount ที่ไหน)

```
$ sudo lvs
LV        VG        Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
kubedata  ubuntu-vg -wi-ao---- 200.00g                                                    
ubuntu-lv ubuntu-vg -wi-ao---- 100.00g                                                    
varlib    ubuntu-vg -wi-ao---- 100.00g    
```

หรือแบบละเอียด:

```
$ sudo lvdisplay

 --- Logical volume ---
  LV Path                /dev/ubuntu-vg/ubuntu-lv
  LV Name                ubuntu-lv
  VG Name                ubuntu-vg
  LV UUID                PA3oTU-KXKV-Oifj-Goib-XUVd-Eq47-2fs1qv
  LV Write Access        read/write
  LV Creation host, time ubuntu-server, 2025-05-11 18:10:14 +0000
  LV Status              available
  # open                 1
  LV Size                100.00 GiB
  Current LE             25600
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           252:0
   
  --- Logical volume ---
  LV Path                /dev/ubuntu-vg/varlib
  LV Name                varlib
  VG Name                ubuntu-vg
  LV UUID                dXHWXc-3j8m-JIbO-3TDH-nf33-RDCd-tXe5am
  LV Write Access        read/write
  LV Creation host, time USER, 2025-05-12 01:52:38 +0000
  LV Status              available
  # open                 1
  LV Size                100.00 GiB
  Current LE             25600
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           252:1
   
  --- Logical volume ---
  LV Path                /dev/ubuntu-vg/kubedata
  LV Name                kubedata
  VG Name                ubuntu-vg
  LV UUID                yDbiqd-yCF1-Ceyf-xRpg-NoQ1-ZjJJ-Emw6CY
  LV Write Access        read/write
  LV Creation host, time USER, 2025-05-12 01:53:22 +0000
  LV Status              available
  # open                 1
  LV Size                200.00 GiB
  Current LE             51200
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           252:2
```

### เช็ค Volume Group (ดูว่าเหลือพื้นที่ LVM เท่าไหร่)

```bash
$ sudo vgdisplay
  --- Volume group ---
  VG Name               ubuntu-vg
  System ID             
  Format                lvm2
  Metadata Areas        1
  Metadata Sequence No  4
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                3
  Open LV               3
  Max PV                0
  Cur PV                1
  Act PV                1
  VG Size               928.46 GiB
  PE Size               4.00 MiB
  Total PE              237685
  Alloc PE / Size       102400 / 400.00 GiB
  Free  PE / Size       135285 / 528.46 GiB
  VG UUID               lc8xFx-Cmdc-YmpG-1CeY-U7V7-pdLI-mgOOHQ
```

เหลือพื้นที่ 528GB ยังเหลือให้สร้าง LV ได้อีกเยอะมาก ๆ

### ดู mountpoint ด้วย:

```bash
$lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINT,LABEL

NAME                        SIZE FSTYPE      MOUNTPOINT       LABEL
sda                         1.8T                              
├─sda1                       16M                              
├─sda2                    886.4G ext4        /mnt/storage-hdd 
└─sda3                    976.6G ntfs                         Entertain
nvme0n1                   931.5G                              
├─nvme0n1p1                   1G vfat        /boot/efi        
├─nvme0n1p2                   2G ext4        /boot            
└─nvme0n1p3               928.5G LVM2_member                  
  ├─ubuntu--vg-ubuntu--lv   100G ext4        /                
  ├─ubuntu--vg-varlib       100G ext4        /var/lib         
  └─ubuntu--vg-kubedata     200G ext4        /opt/kube-data   
```

###  เช็ค /etc/fstab ที่จะใช้ตอน boot

```bash
$ cat /etc/fstab
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
# / was on /dev/ubuntu-vg/ubuntu-lv during curtin installation
/dev/disk/by-id/dm-uuid-LVM-lc8xFxCmdcYmpG1CeYU7V7pdLImgOOHQPA3oTUKXKVOifjGoibXUVdEq472fs1qv / ext4 defaults 0 1
# /boot was on /dev/nvme0n1p2 during curtin installation
/dev/disk/by-uuid/806f8f20-a4bc-44b4-8dc3-e78e98fcc088 /boot ext4 defaults 0 1
# /boot/efi was on /dev/nvme0n1p1 during curtin installation
/dev/disk/by-uuid/8040-4E0A /boot/efi vfat defaults 0 1
/swap.img       none    swap    sw      0       0
/dev/ubuntu-vg/varlib /var/lib ext4 defaults 0 2
/dev/ubuntu-vg/kubedata /opt/kube-data ext4 defaults 0 2
/dev/sda2 /mnt/storage-hdd ext4 defaults 0 2
```