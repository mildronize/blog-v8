+++
title = "เขียนบล็อกด้วยภาษา Markdown ด้วยแอพจดโน๊ต Bear บน iOS"
description = "เขียนบล็อกด้วย Bear อัพโหลดรูปภาพขึ้น Dropbox โดยใช้แอพ Shortcuts"
date = "2018-07-20"

[taxonomies]
categories = [ "Automate" ]
tags = [
  "Automate",
  "iOS",
  "Bear Writer",
  "Dropbox",
  "Apple Shortcuts"
]

[extra]
image = "https://www.dropbox.com/s/ctdl5fr7c7cplbb/2018-07-20-%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%9A%E0%B8%A5%E0%B9%87%E0%B8%AD%E0%B8%81%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2%20Markdown%20%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B9%81%E0%B8%AD%E0%B8%9E%E0%B8%88%E0%B8%94%E0%B9%82%E0%B8%99%E0%B9%8A%E0%B8%95%20Bear%20%E0%B8%9A%E0%B8%99%20iOS-0.jpg?raw=1"
id = "nbqw9e1"
unsplashImgCoverId = "Uz0uQXvOtEY"
+++

> ย้าย blog กลับมาใช้ Jekyll เหมือนเดิมแล้วคับ

เนื่องจากผมเอง[เขียน blog](http://mildronize.github.io) กับ [Static page generator](https://www.staticgen.com) ซึ่งใช้ภาษา Markdownในการเขียนเนื้อหา ซึ่งใช้ [Jekyll](https://jekyllrb.com) ในในการแปลงเป็นหน้าเว็บให้ เลยหาเครื่องมือหาเหมาะๆ ที่ไม่ต้องอยู่หน้าคอม แล้วมานั่งเขียนบล็อก อยากแบบเขียนช่วงว่างๆ ตาม มุมพักผ่อนต่างๆ ที่ไม่ต้องพกโน๊ตบุ๊คไปด้วยคับ ( ไว้มีโอกาสจะเขียน เรื่อง Static page generator อีกบล็อกครับ)

เลยลองหาแอพที่เอาไว้ใช้เขียน blog ดูว่าตัวไหนดีและฟรีบ้าง ก็มาเจอ [Bear](http://www.bear-writer.com) นี่แหละครับ จริงๆ bear เป็น แอพไว้จดโน๊ตอารมณ์เดียวกับ Evernote นั่นแหละครับ
![https://www.dropbox.com/s/ctdl5fr7c7cplbb/2018-07-20-%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%9A%E0%B8%A5%E0%B9%87%E0%B8%AD%E0%B8%81%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2%20Markdown%20%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B9%81%E0%B8%AD%E0%B8%9E%E0%B8%88%E0%B8%94%E0%B9%82%E0%B8%99%E0%B9%8A%E0%B8%95%20Bear%20%E0%B8%9A%E0%B8%99%20iOS-0.jpg?dl=0](https://www.dropbox.com/s/ctdl5fr7c7cplbb/2018-07-20-%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%9A%E0%B8%A5%E0%B9%87%E0%B8%AD%E0%B8%81%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2%20Markdown%20%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B9%81%E0%B8%AD%E0%B8%9E%E0%B8%88%E0%B8%94%E0%B9%82%E0%B8%99%E0%B9%8A%E0%B8%95%20Bear%20%E0%B8%9A%E0%B8%99%20iOS-0.jpg?raw=1)


### ข้อดีของ Bear ที่ทำให้ผมชอบมากๆ คือ
* Bear คือแอพจดโน๊ตที่รวมกับ Markdown ได้อย่างแนบเนียน ไม่เหมือนกับอารมณ์เขียน Markdown ทั่วๆ ไป
* สามารถใช้ร่วมกับ Markdown ได้ดีเลยครับ
* มี syntax blockquote แบบไว้แนบโค๊ดได้เลย ไม่ต้องไปฝากไว้ที่ gist ของ github
* สามารถเห็นรูปภาพในการเขียนโน๊ตได้เลยครับ ทำให้มองเห็นภาพได้เลยขณะพิมพ์ ไม่จำเป็นต้องกด preview ดูผลลัพธ์ครับ พูดง่ายๆ เป็น WYSIWYG ครับ
* เป็นแอพที่สามารถใช้งานร่วมกับแอพอื่นๆ หรือ platform อื่นๆ ได้ดีครับ คือสามารถ export ออกเป็นไฟล์ Markdown พร้อมกับมีโฟลเดอร์รูปภาพซึ่งสามารถไปใช้กับ Markdown editor ทั่วๆ ไปได้เลยครับ ( รูปแบบนี้ Bear เรียกว่า Text Bundle )
* **สุดท้ายที่ชอบมากๆ** คือ สามารถใส่แท็กแบบ inline ได้เลยแบบ ไม่ต้องไปกดปุ่มใดๆ เพิ่มเติมเลย และสามารถสร้างลิงค์ไปโน๊ตอันอื่นๆ ได้ด้วย ซึ่ง

ส่วนข้อเสียก็มีแค่ให้ใช้ในตระกูลของ Apple เพียงอย่างเดียวครับ แต่สามารถ export เป็น Markdown ปกติได้ แบบนี้ให้อภัยได้

## รูปภาพจะเก็บอย่างไร ?
ใน [blog ที่ใช้ Jekyll](http://mildronize.github.io) นั้นอัพโหลดรูปภาพเป็น ไฟล์ที่อยู่ static ของ git repo ครับ ซึ่งมันไม่สะดวกเอามากๆ และเกิดความลำบากในการย้ายบล็อกในอนาคต
แล้ว git repo เองก็มีข้อจำกัดในเรื่องของ[พื้นที่ที่สามารถใช้งานได้ประมาณ 1 GB](https://help.github.com/articles/what-is-my-disk-quota/) ครับ

ต่อไปก็มองหาที่เก็บรูปภาพแบบถาวรที่สามารถเอาลิงค์ตรงมาใส่ใน html ได้ ซึ่งตอนแรกตั้งใจว่าจะเก็บใน imgur แต่ไม่แน่ใจว่าจะเก็บถาวรมั้ย จาก[ที่เค้าคุยกันในกระทู้บอกว่า imgur จะเก็บถาวร](https://www.quora.com/Imgur-How-long-are-the-images-stored-before-being-purged) และอีกอย่างคงจัดการได้ยาก

**ทางออกคือ Dropbox** เป็น cloud storage ชื่อดังเจ้าเดียวเท่าที่ผมรู้จัก ( Box, Google Drive, OneDrive และ iCloud ทำไม่ได้ครับ) ที่สามารถเข้าถึง direct link ของรูปภาพได้ โดยแค่เปลี่ยนคำลงท้าย url จาก `dl=0` เป็น `raw=1`

### การบริหารจัดการโน๊ตใน Bear สำหรับเขียนบล็อก
ผมใช้ tag ทั้งสิ้น 3 แบบครับ
1. `blog/draft` สำหรับเขียนร่างบล็อก
2. `blog/publish` สำหรับ blog ที่เผยแพร่แล้ว
3. `blog/template` สำหรับ template markdown ที่จะใช้ในการเขียน blog บน GatsbyJS ครับ

ส่วน template ที่ใช้ในการเขียนบล็อก
![https://www.dropbox.com/s/7dvcxre78kq2toi/2018-07-20-%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%9A%E0%B8%A5%E0%B9%87%E0%B8%AD%E0%B8%81%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2%20Markdown%20%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B9%81%E0%B8%AD%E0%B8%9E%E0%B8%88%E0%B8%94%E0%B9%82%E0%B8%99%E0%B9%8A%E0%B8%95%20Bear%20%E0%B8%9A%E0%B8%99%20iOS-1.jpeg?dl=0](https://www.dropbox.com/s/7dvcxre78kq2toi/2018-07-20-%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%9A%E0%B8%A5%E0%B9%87%E0%B8%AD%E0%B8%81%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2%20Markdown%20%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B9%81%E0%B8%AD%E0%B8%9E%E0%B8%88%E0%B8%94%E0%B9%82%E0%B8%99%E0%B9%8A%E0%B8%95%20Bear%20%E0%B8%9A%E0%B8%99%20iOS-1.jpeg?raw=1)
และเมื่อ export เป็น Text Bundle ที่เป็นภาษา Markdown ดังนี้ครับ

```markdown
# Template ชื่อบล็อก
---
title: "เขียนบล็อกด้วยภาษา Markdown ด้วยแอพจดโน๊ต Bear บน iOS"
date: "7/20/2018"
tags:
	* Bear
---
#blog/draft

**Remove this tag** #blog/template
```


## ต่อไปประมวลผลไฟล์ และอัพโหลดรูปขึ้น dropbox ด้วยแอพ Shortcuts

![https://www.dropbox.com/s/7dranoizgn7ph78/2018-07-20-%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%9A%E0%B8%A5%E0%B9%87%E0%B8%AD%E0%B8%81%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2%20Markdown%20%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B9%81%E0%B8%AD%E0%B8%9E%E0%B8%88%E0%B8%94%E0%B9%82%E0%B8%99%E0%B9%8A%E0%B8%95%20Bear%20%E0%B8%9A%E0%B8%99%20iOS-2.jpg?dl=0](https://www.dropbox.com/s/7dranoizgn7ph78/2018-07-20-%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%9A%E0%B8%A5%E0%B9%87%E0%B8%AD%E0%B8%81%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2%20Markdown%20%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B9%81%E0%B8%AD%E0%B8%9E%E0%B8%88%E0%B8%94%E0%B9%82%E0%B8%99%E0%B9%8A%E0%B8%95%20Bear%20%E0%B8%9A%E0%B8%99%20iOS-2.jpg?raw=1)

ตั้งแต่รู้จักกับแอพ Shortcuts นี้รู้สึกชีวิตจะสะดวกสบายหลายอย่าง มันช่วยมันง่ายที่เราต้องทำซ้ำๆ บ่อยให้เรา ก็เหมือนกับการเขียนโปรแกรมนั่นแหละคับ แต่มันจะเป็นการลากบล็อก ( อารมณ์เหมือน module ที่มี input และ output ) มาเรียงต่อกันเป็นชุดคำสั่งครับ
ทำให้เราสามารถทำ automation ง่ายๆ ได้ครับ

### ใน Shortcuts: Publish bear note to markdown ทำอะไรบ้าง

1. ขอสิทธิ์การเขียนไฟล์ลงบน Dropbox ในทีนี้ผมตั้งค่าให้เก็บไฟล์รูปที่ `/Public/blog`
2. ใส่ชื่อของโน๊ตลงไปใน `[POST_TITLE]`
3. ใส่วันที่ปัจจุบันลงไปใน `[TITLE]`
4. อัพโหลดรูปขึ้น dropbox ทุกรูป แล้วแก้ url ให้เป็น direct link
5. จากนั้นแก้รูปแบบให้ตรงกับ yaml frontmatter เป็นอันเสร็จ

## ขั้นตอนการนำไปใช้
1. เตรียมแอพที่เกี่ยวข้อง Bear, Shortcuts, Git2Go และ account dropbox
2. ดาวน์โหลด Shortcuts  [publish bear note to markdown](https://workflow.is/workflows/de83eed7d725415dac37d35b46ce946e) ไปใช้
3. เขียน Blog ด้วย bear โดยใช้ template ข้างบน หรือกำหนด template เองก็ได้
4. ลบข้อความ `**Remove this tag** `
5. กดไปที่ Export as ในเมนู แล้วเลือก Text Bundle
6. เลือก Run as Workflow
7. เลือก `Publish bear note to markdown `
8. เลือกแอพที่จะเผยแพร่ ในที่นี้ผมใช้ Git2Go ในการเผยแพร่คับ

Download [publish bear note to markdown](https://workflow.is/workflows/de83eed7d725415dac37d35b46ce946e)
Read more at [my gist](https://gist.github.com/mildronize/1da2120b1d2f0a25a7ecc429c06d3dce)
P.S. For English version, I will write later.


---

 *Cross published at [Medium.com](https://medium.com/@mildronize/%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%9A%E0%B8%A5%E0%B9%87%E0%B8%AD%E0%B8%81%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2-markdown-%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B9%81%E0%B8%AD%E0%B8%9E%E0%B8%88%E0%B8%94%E0%B9%82%E0%B8%99%E0%B9%8A%E0%B8%95-bear-%E0%B8%9A%E0%B8%99-ios-d85908c2cea5)*

