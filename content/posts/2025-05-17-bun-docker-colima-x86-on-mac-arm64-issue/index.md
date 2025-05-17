+++
title = "ลองใช้ Bun สร้าง Docker image บน Colima x86 และ Mac Arm64 (M Series) แล้วเจอปัญหาแบบไม่คาดคิด"
date = "2025-05-17"

[taxonomies]
categories = [ "DevOps" ]
tags = [
  "Bun",
  "Docker",
  "Colima",
  "Mac M1",
  "QEMU",
  "Arm64",
  "x86",
  "M Series"
]

[extra]
id = "19kgsqu"
+++

 
![cover](cover.jpg)

{% note(header="สรุปสั้น ๆ") %}
ลองใช้ Bun สร้าง Docker image บน Colima (x86) แล้วเจอปัญหา crash แบบเงียบ ๆ เพราะ binary ของ Bun ไม่ compatible กับ QEMU โดยเจอ Error แบบเงียบๆ ว่า Illegal instruction
{% end %}

ช่วงนี้ผมมีโปรเจกต์เล็ก ๆ ที่กำลังทำอยู่ เป็น Slack Bot ที่เขียนด้วย TypeScript
เลยมีความคิดว่า… ถ้าลองย้าย runtime จาก Node.js มาเป็น [Bun](https://bun.sh) จะดีขึ้นแค่ไหน?

Bun มันน่าสนใจตรงที่:

* เร็วกว่า Node แบบรู้สึกได้
* ใช้แทนทั้ง runtime, bundler และ test runner ได้ในตัว
* คำสั่งก็สั้นดี ไม่ต้องแยกใช้ `node`, `ts-node` หรือพวก bundler เพิ่มเติม

พอเห็น [docker image อย่างเป็นทางการของ Bun](https://hub.docker.com/r/oven/bun) ก็ยิ่งรู้สึกว่า “น่าจะใช้กับ production ได้ไม่ยาก”
เลยตั้งใจจะลอง build Docker image ของแอปตัวเองด้วย Bun ให้ได้แบบ production-ready แล้วเอาไป deploy ผ่าน Colima ที่ผมใช้บน Mac M1

ซึ่งก็คิดไว้ในใจว่า…

> “ถ้า build เป็น x86 แล้วใช้ Colima จำลอง x86 ด้วย ก็น่าจะ run ได้แหละมั้ง?”

แน่นอนครับ ว่าชีวิตจริงมันไม่ได้ง่ายขนาดนั้น 555

## ตอนที่ลองทำ

ผมเริ่มจากเขียน `Dockerfile` ง่าย ๆ ที่ใช้ base image ของ Bun โดยตรง
เพื่อให้ image มีขนาดเล็กที่สุด เลยเลือกใช้ `oven/bun:alpine`

```Dockerfile
# Build base
FROM oven/bun:alpine AS base
WORKDIR /usr/app

# Install dev dependencies (cached)
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy source code and dev dependencies
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

FROM base AS release

WORKDIR /usr/app

# Copy prod dependencies and source file
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/app .
COPY --from=prerelease /usr/app/package.json .

USER bun
EXPOSE 3000
ENTRYPOINT ["bun", "run", "src/main.ts"]
```

จากนั้นใช้ GitHub Actions เป็นตัว build และ push image ขึ้น [Azure Container Registry (ACR)](https://learn.microsoft.com/en-us/azure/container-registry/) แบบ private
ตัว pipeline ก็ไม่ได้ซับซ้อนอะไร ใช้แค่ `docker/build-push-action` แล้ว tag เป็น `latest`

ตัวอย่าง GitHub Actions ก็ประมาณนี้ ใช้ Cache บน GitHub Actions ด้วยนะ

```yaml
name: Build Docker Image with Bun & Check Size

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  IMAGE_NAME: ai-platform
  IMAGE_TAG: latest

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Cache Docker layers
        uses: actions/cache@v4
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-buildx-

      - name: Log in to Azure Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ secrets.ACR_LOGIN_SERVER }}
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}

      - name: Build Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: true # Automatically push the image to the registry
          load: true # Set true when we want to see the image in the local docker, example: check image size
          tags: ${{ secrets.ACR_LOGIN_SERVER }}/${{ env.IMAGE_NAME }}:${{ env.IMAGE_TAG }}
          cache-from: type=local,src=/tmp/.buildx-cache
          cache-to: type=local,dest=/tmp/.buildx-cache-new,mode=max

      - name: Move cache
        run: |
          rm -rf /tmp/.buildx-cache
          mv /tmp/.buildx-cache-new /tmp/.buildx-cache
```

พอ build เสร็จ ผมก็ไปฝั่ง local ที่ใช้ [Colima](https://github.com/abiosoft/colima) บน Mac M1
ซึ่งปกติจะรันเป็น `arm64` แต่คราวนี้อยากเทสต์ให้แน่ใจว่า image แบบ `x86_64` จะรันได้แน่ ๆ
เลยสั่ง start แบบระบุ architecture ไปเลย:

```bash
colima start --arch x86_64
```

จากนั้นก็ลองดึง image ที่ build ไว้ขึ้นมารันด้วย `docker compose`
เพื่อให้แน่ใจว่าใช้ของใหม่จริง ๆ ก็ใส่ `--pull always` ไปด้วย:

ตัวอย่าง `docker-compose.yml` ก็ประมาณนี้

```yaml
services:
  app:
    image: my-azure-acr.azurecr.io/ai-platform:latest
    env_file:
      - .env # Load from .env file like dotenv
    ports:
      - "${PORT}:${PORT}"   # Use the same port as in .env
    volumes:
      - ai-data:/usr/app/.data
    restart: unless-stopped

volumes:
  ai-data:
```

จากนนั้นก็ลองรันด้วยคำสั่ง:

```bash
docker compose up -d --pull always
```

ณ จุดนี้ ทุกอย่างดูเหมือนจะโอเคนะ…
Build ผ่าน, Push สำเร็จ, Image ดึงลงมาได้, Container ก็ดูเหมือนจะ start แล้ว…

แต่ความเงียบผิดปกติก็เริ่มขึ้นตรงนี้แหละ

## แล้วมันก็พังแบบเงียบ ๆ

หลังจากสั่ง `docker compose up -d` แล้วทุกอย่างดูเหมือนจะปกติ ผมก็ลองดูสถานะ container ด้วยคำสั่ง:

```bash
docker ps
```

สิ่งที่เจอคือ container ขึ้นจริง แต่ขึ้นแค่แป๊บเดียวแล้วเข้าโหมด:

```
Restarting (132) every few seconds
```

ลองดู log ด้วย:

```bash
docker logs <container-id>
```

...ไม่มีอะไรออกมาเลยครับ โล่งมาก

เข้าใจว่า "อาจจะ crash ก่อนจะเขียน log ทัน" เลยลอง shell เข้าไปดูด้วย:

```bash
docker exec -it <container-id> sh
```

ลองรัน `bun --version` ดูแบบไม่คิดอะไรมาก:

```
bun --version
```

แล้วก็เจอคำตอบของทุกอย่างตรงนี้เลยครับ:

```
Illegal instruction
```

คือ binary ของ Bun (ใน image `oven/bun:alpine`) มันใช้ instruction บางอย่างที่ QEMU ใน Colima รันไม่ได้
แม้ว่าผมจะ start Colima แบบ `--arch x86_64` แล้วก็ตาม

ผมลองเปลี่ยนไปใช้ image `oven/bun:1` ที่เป็น tag หลัก ก็เจอปัญหาเดียวกันเป๊ะ

พอถึงตรงนี้ก็เลยชัดเจนว่า...

> Bun บน Colima (แม้จะจำลอง x86) ยังรันไม่ได้แน่ ๆ ไม่ว่าจะใช้ image แบบ alpine หรือ full tag ก็ตาม
> ถึงจะ build มาแบบ x86 แล้วก็เถอะ ถ้า run-time มันไม่ support instruction นั้น → ก็พังอยู่ดี

ได้เลยจ้า! ปลายฟ้าปรับ Section 4 ให้ใหม่แบบไม่พูดถึง Docker Desktop ตามที่มายต้องการ
กระชับ ตรงประเด็น และยังคงโทนเล่าเรื่องสบาย ๆ เหมือนเดิม:

## แล้วเราจะแก้ยังไงดี

พอรู้ว่า Bun รันบน Colima ไม่ได้ ก็เลยลองไล่หาทางแก้
โดยยังอยากคงแนวทางเดิมไว้ให้ใกล้เคียง production จริงมากที่สุด

สิ่งแรกที่ลองคือเปลี่ยนจาก `oven/bun:alpine` มาใช้ `oven/bun:1`
ซึ่งเป็น base image แบบเต็มที่ขนาดใหญ่ขึ้น (ไม่ใช่ alpine)
แต่ก็ยังเจอปัญหา `Illegal instruction` เหมือนเดิม
สรุปคือ **ทั้งสอง image ยังใช้ binary ที่ QEMU ใน Colima รันไม่ได้**

สุดท้ายเลยตัดสินใจเปลี่ยน base image จาก Bun กลับมาใช้ Node.js
แค่เพื่อให้รันบน Colima ได้ แล้วค่อยไป optimize เรื่องขนาด image อีกที
อย่างน้อยก็ได้ test flow ของระบบต่อได้ก่อน ไม่ต้องติดที่ runtime

**ส่วนเรื่อง image size ยังใหญ่เพราะ `node_modules` ต้อง COPY เข้าไปทั้งก้อน — อันนี้ยังไม่ได้แก้ตอนนี้ครับ**
เดี๋ยวไว้ blog หน้าจะมาชวนคุยต่อว่า ถ้าเราทำการ bundle ก่อน (เช่นด้วย `esbuild` หรือ `bun bun`)
เราจะลดขนาด image ลงได้ขนาดไหน และยังมีวิธีแยก native modules ออกได้ยังไงบ้าง

มาแล้วจ้า! นี่คือ **Section 5: บทเรียน & ชวนคิดต่อ**
เป็นตอนจบของโพสต์นี้ ที่สรุปสิ่งที่เจอ พร้อมโยนคำถามเบา ๆ ทิ้งท้ายให้คนอ่านได้คิดต่อ:

## บทเรียน

พอลองมาทั้งหมด สรุปสั้น ๆ ได้ว่า…

* Bun น่าสนใจมาก แต่ตอนนี้ยังมีข้อจำกัดเรื่อง compatibility กับบาง runtime environment อย่าง QEMU บน Colima
* ต่อให้ build ด้วย x86 และระวังเรื่อง architecture แล้ว แต่ถ้า binary ใช้ instruction ที่ layer ข้างล่างสุดไม่รองรับ → ก็รันไม่ได้อยู่ดี
* เวลาเจอปัญหาพวกนี้ สิ่งที่ยากกว่าการแก้คือ…การหาว่ามันพังเพราะอะไร
  เพราะบางครั้ง log ก็ไม่มี, error ก็ไม่บอก, ทุกอย่างดูเหมือนปกติแต่ run ไม่ได้

และที่สำคัญคือ…

> การ optimize ขนาด image ยังไม่จบแค่นี้
> แค่ใช้ Bun แล้ว build image → ยังไม่ได้ image ที่เบาแบบที่หวังไว้
> เพราะ `bun install` ยังต้องพา `node_modules` ทั้งก้อนไปด้วย

ถ้าอยากลดขนาดจริง ๆ — ต้องเปลี่ยน mindset จาก “run source ตรง ๆ” → มาเป็น “bundle ให้จบก่อนค่อย COPY เข้า image”

ซึ่งเดี๋ยว blog หน้าผมจะมาเล่าต่อเรื่องนี้
รวมถึงเปรียบเทียบว่าใช้ `esbuild` หรือ `bun bun` ช่วย bundle แล้วขนาดลดลงแค่ไหน
และจะมีแนวทางแยก native module อย่างไรให้เหลือเบาที่สุด

## มุมชวนคิด

ใครเคยเจอปัญหาอะไรคล้าย ๆ แบบนี้บ้าง?
หรือเคยต้อง debug อะไรที่ crash เงียบ ๆ บน container แล้วไม่มี log เลย?

หรือถ้าใครมีเทคนิค build image ให้บางเฉียบแบบไม่ต้องเอา `node_modules` ติดมาด้วย — มาแชร์กันได้เลยครับ

จบโพสต์นี้แบบงง ๆ กับ CPU instruction set ไปก่อน
ไว้เจอกันใหม่ในตอน “bundle ให้จบ แล้วเหลือแค่ของจำเป็น” เร็ว ๆ นี้ครับ!

(ขอบคุณที่อ่านมาถึงตรงนี้นะ \:D)
