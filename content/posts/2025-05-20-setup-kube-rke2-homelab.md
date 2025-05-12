+++
title = "Setup Kube RKE2 Homelab"
date = "2025-05-20"
draft = true

[taxonomies]
categories = [ "Kubernetes" ]
tags = [ "Kubernetes", "ubuntu" ]

[extra]
id = "24gzuld"
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

ถ้าคุณใช้ LVM (ตามที่ใช้กับ `/` อยู่แล้ว):

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

### After Reboot i've check again

```bash
$ mount | grep -E '/var/lib|/opt/kube-data|/mnt/storage-hdd'
/dev/mapper/ubuntu--vg-kubedata on /opt/kube-data type ext4 (rw,relatime)
/dev/mapper/ubuntu--vg-varlib on /var/lib type ext4 (rw,relatime)
/dev/sda2 on /mnt/storage-hdd type ext4 (rw,relatime)
```

## 2. ติดตั้ง RKE2

✅ ขั้นตอนติดตั้ง RKE2
🔹 1. ติดตั้ง RKE2 Binary
```bash
curl -sfL https://get.rke2.io | sudo sh -
```
🔹 2. Enable และ Start RKE2 Service
```bash
sudo systemctl enable rke2-server.service
sudo systemctl start rke2-server.service
```
ใช้เวลา 1–2 นาทีจ้า อย่าเพิ่งตกใจ

🔹 3. ตรวจสอบสถานะ
```bash
sudo journalctl -u rke2-server -f
```
ดู log realtime จนกว่าจะเห็นบรรทัดขึ้นว่า kubelet is running หรือ Node controller sync successful


### ดู Log

```bash
sudo journalctl -u rke2-server -f
May 12 03:01:15 USER rke2[2094]: time="2025-05-12T03:01:15Z" level=info msg="Imported images from /var/lib/rancher/rke2/agent/images/kube-proxy-image.txt in 1.644912ms"
May 12 03:01:16 USER rke2[2094]: time="2025-05-12T03:01:16Z" level=info msg="Started tunnel to 192.168.1.107:9345"
May 12 03:01:16 USER rke2[2094]: time="2025-05-12T03:01:16Z" level=info msg="Stopped tunnel to 127.0.0.1:9345"
May 12 03:01:16 USER rke2[2094]: time="2025-05-12T03:01:16Z" level=info msg="Connecting to proxy" url="wss://192.168.1.107:9345/v1-rke2/connect"
May 12 03:01:16 USER rke2[2094]: time="2025-05-12T03:01:16Z" level=info msg="Proxy done" err="context canceled" url="wss://127.0.0.1:9345/v1-rke2/connect"
May 12 03:01:16 USER rke2[2094]: time="2025-05-12T03:01:16Z" level=info msg="error in remotedialer server [400]: websocket: close 1006 (abnormal closure): unexpected EOF"
May 12 03:01:16 USER rke2[2094]: time="2025-05-12T03:01:16Z" level=info msg="Handling backend connection request [USER]"
May 12 03:01:16 USER rke2[2094]: time="2025-05-12T03:01:16Z" level=info msg="Remotedialer connected to proxy" url="wss://192.168.1.107:9345/v1-rke2/connect"
May 12 03:01:27 USER rke2[2094]: time="2025-05-12T03:01:27Z" level=info msg="Adding node USER-bdc7dea0 etcd status condition"
May 12 03:01:50 USER rke2[2094]: time="2025-05-12T03:01:50Z" level=info msg="Tunnel authorizer set Kubelet Port 0.0.0.0:10250"
```

✅ สถานะของ RKE2: ระบบกำลัง start ขึ้นสำเร็จแล้ว!
🔍 จุดสำคัญจาก log:
log
Copy
Edit
Remotedialer connected to proxy
Adding node USER-bdc7dea0 etcd status condition
Tunnel authorizer set Kubelet Port 0.0.0.0:10250
🔄 สิ่งที่ระบบทำอยู่:
นำเข้ารูป container (Imported images)

เชื่อมต่อ tunnel และ proxy สำเร็จ (Remotedialer connected)

เพิ่ม node USER-xxxxxxx เข้าระบบ etcd

เปิดพอร์ต kubelet → 0.0.0.0:10250

🔹 4. ตั้งค่า kubectl
```bash
mkdir -p ~/.kube
sudo cp /etc/rancher/rke2/rke2.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
export KUBECONFIG=~/.kube/config
```

แต่ยังไม่มี kubectl ติดตั้งในเครื่อง แต่ Rancher RKE2 มี kubectl อยู่ใน path ของมันเอง
```bash
sudo ln -s /var/lib/rancher/rke2/bin/kubectl /usr/local/bin/kubectl
```

```bash
kubectl get nodes
NAME       STATUS   ROLES                       AGE     VERSION
USER   Ready    control-plane,etcd,master   5m31s   v1.31.8+rke2r1
```

## Setup Local PC (on Mac)

คัดลอกไฟล์ rke2.yaml ไปยัง Mac (เปลี่ยน IP/Path ตามจริง)

หรือใช้ SCP

```bash
sudo cp /etc/rancher/rke2/rke2.yaml /home/USER/rke2.yaml
sudo chown USER:USER /home/USER/rke2.yaml
scp -i ~/.ssh/my_home_lab/id_rsa USER@192.168.1.107:/home/USER/rke2.yaml ~/Downloads/rke2.yaml
```

### แก้ไข Context Name

ใช้ yq นะ อย่าลืมลง

```bash
# ย้ายมาที่ ~/.kube (Optional)
mv ~/Downloads/rke2.yaml ~/.kube

cd ~/.kube
```

สร้าง bash script `rename-kubeconfig.sh`

```bash
#!/bin/bash

# 📌 รับ argument
CONTEXT_NAME="$1"
CLUSTER_NAME="$2"
USER_NAME="$3"
KUBECONFIG_PATH="$HOME/.kube/rke2.yaml"

# ✅ ตรวจสอบ input
if [[ -z "$CONTEXT_NAME" || -z "$CLUSTER_NAME" || -z "$USER_NAME" ]]; then
  echo "❌ Usage: $0 <context_name> <cluster_name> <user_name>"
  exit 1
fi

# ✅ เช็คว่า yq ติดตั้งแล้ว
if ! command -v yq &> /dev/null; then
  echo "❌ 'yq' not found. Install it with 'brew install yq'"
  exit 1
fi

echo "🔧 Updating kubeconfig: $KUBECONFIG_PATH"
echo "➡️  Context: $CONTEXT_NAME"
echo "➡️  Cluster: $CLUSTER_NAME"
echo "➡️  User: $USER_NAME"

# 🔁 แก้ชื่อทั้งหมด in-place
yq -i "(.clusters[] | select(.name == \"default\") | .name) = \"$CLUSTER_NAME\"" "$KUBECONFIG_PATH"
yq -i "(.clusters[] | select(.name == \"$CLUSTER_NAME\") | .cluster.server) = \"https://192.168.1.107:6443\"" "$KUBECONFIG_PATH"
yq -i "(.users[] | select(.name == \"default\") | .name) = \"$USER_NAME\"" "$KUBECONFIG_PATH"
yq -i "(.contexts[] | select(.name == \"default\") | .name) = \"$CONTEXT_NAME\"" "$KUBECONFIG_PATH"
yq -i "
  (.contexts[] | select(.name == \"$CONTEXT_NAME\") | .context.cluster) = \"$CLUSTER_NAME\" |
  (.contexts[] | select(.name == \"$CONTEXT_NAME\") | .context.user) = \"$USER_NAME\"
" "$KUBECONFIG_PATH"
yq -i ".current-context = \"$CONTEXT_NAME\"" "$KUBECONFIG_PATH"

echo "✅ Done! You can now merge it into ~/.kube/config with:"
echo "   KUBECONFIG=~/.kube/config:$KUBECONFIG_PATH kubectl config view --flatten > /tmp/config && mv /tmp/config ~/.kube/config"
```

รัน script
```
chmod +x rename-kubeconfig.sh

./rename-kubeconfig.sh my_homelab my_homelab-cluster my_homelab-defaultUser
```

### เริ่ม merge config (Context) ใน Mac

```bash

# 1. ตั้งค่า environment เฉพาะรอบนี้
export KUBECONFIG=~/.kube/config:~/.kube/rke2.yaml

# 2. รวม config และ flatten ให้อยู่ในไฟล์ temp
kubectl config view --flatten > /tmp/kubeconfig-merged.yaml

# 3. สำรองของเดิมไว้ก่อน
cp ~/.kube/config ~/.kube/config.bak

# 4. ใช้ config ใหม่แทน
mv /tmp/kubeconfig-merged.yaml ~/.kube/config
```

### ตรวจสอบ Context

```bash
kubectl config get-contexts
CURRENT   NAME                     CLUSTER                  AUTHINFO                                               NAMESPACE
           my_homelab               my_homelab-cluster       my_homelab-defaultUser                                 
*          rancher-desktop          rancher-desktop          rancher-desktop                                        
```

เย้ๆ มาแว้ว
จากนั้นก็ Set context ให้เป็น `my_homelab` ได้เลย

```bash
kubectl config use-context my_homelab
```

### ตรวจสอบ Node

```bash
$ kubectl get nodes
NAME       STATUS   ROLES                       AGE   VERSION
USER   Ready    control-plane,etcd,master   66m   v1.31.8+rke2r1
```

เย้ๆ ได้แล้ว

#### สำหรับ Production
## ❓ แบบที่ได้จาก `rke2.yaml` ตอนนี้คืออะไร?

* เป็น **default admin user** ของ RKE2 ที่ฝัง cert/key มาด้วย
* ใช้ client cert (`client-certificate-data`, `client-key-data`) แบบ full access
* ใครได้ไฟล์นี้ = ได้ root access cluster ทันที ⚠️

---

## 🧠 คำตอบสั้น:

> ✅ ถ้าคุณใช้งานคนเดียวใน Home Lab → ใช้ `rke2.yaml` ได้เลย ปลอดภัยพอ
> ❌ แต่ถ้าจะ **มีหลาย user**, ใช้งานจากหลายเครื่อง, หรืออยากควบคุม RBAC → **ควรสร้าง user ใหม่ เช่น `admin` / `readonly` / `dev`**

---

## 🔧 แล้วควรทำยังไงถ้าอยากมี user ใหม่?

### ✅ ใช้ระบบ ServiceAccount + RoleBinding

ใน K8s (รวมถึง RKE2) user จริง ๆ จะมาจาก 2 แบบ:

| ประเภท User          | วิธีสร้าง                       | ใช้ใน...                           |
| -------------------- | ------------------------------- | ---------------------------------- |
| TLS User             | กำหนด cert/key เองใน kubeconfig | ใช้กับ kubeadm หรือ cert manager   |
| **ServiceAccount** ✅ | สร้างใน namespace + token       | ใช้งานจริงใน K8s, RKE2, production |

---

### 🧪 ตัวอย่าง: สร้าง user ชื่อ `admin-user` แบบ read/write

```bash
kubectl create serviceaccount admin-user -n kube-system
kubectl create clusterrolebinding admin-user-binding \
  --clusterrole=cluster-admin \
  --serviceaccount=kube-system:admin-user
```

แล้วสร้าง token:

```bash
kubectl -n kube-system create token admin-user
```

> ได้ token แล้วเอาไปใช้ใน kubeconfig ฝั่ง Mac ก็ได้เลย

---

## 🔒 แบบแนะนำใน Home Lab

| ถ้า...                   | ผมแนะนำ                             |
| ------------------------ | ------------------------------------ |
| ใช้คนเดียว               | ใช้ `rke2.yaml` ได้เลย ✅             |
| ใช้หลายเครื่องหรือจะแชร์ | ✅ สร้าง ServiceAccount แยกแต่ละ user |
| เตรียม production จริง   | ใช้ cert หรือ OIDC auth แบบจัดเต็ม   |

## ลอง Deploy Ngnix แบบง่ายๆ

สร้างไฟล์ `nginx-deploy.yaml` ขึ้นมา

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:stable
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

Apply เลยจ้า

```bash
kubectl apply -f nginx-deploy.yaml
```

ตรวจสอบสถานะ

```bash
$ kubectl get deploy,pods,svc
NAME                               READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-deployment   1/1     1            1           21s

NAME                                    READY   STATUS    RESTARTS   AGE
pod/nginx-deployment-677db6c969-7ttsx   1/1     Running   0          20s

NAME                    TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
service/kubernetes      ClusterIP   10.43.0.1       <none>        443/TCP   71m
service/nginx-service   ClusterIP   10.43.148.242   <none>        80/TCP    20s
```

เย้ มาแว้ว

ต่อไปก็ port forward หรือ expose service ออกไปข้างนอกได้เลย

```bash
kubectl port-forward svc/nginx-service 8080:80
```

เปิด browser ไปที่ http://localhost:8080 ก็จะเห็นหน้า Nginx แล้ว 🎉