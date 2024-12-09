+++
title = "ได้ 99 คะแนนจาก Google Insights & เรียนรู้การทำ web optimization"
date = "2018-09-17"

[taxonomies]
tags = [
  "Web Optimization",
  "Google Insights",
  "Responsive Web Design",
  "Webpack",
  "Jekyll"
]
categories = [ "Web Optimization" ]

[extra]
image = "https://www.dropbox.com/s/lxir9pr41qsc9eu/cover.jpg?raw=1"
uuid = "i4kssit"
unsplashImgCoverId = "a_PDPUPuNZ8"
+++


> Blog นี้เขียนตอนสมัยยังใช้ Jekyll อยู่ ซึ่งสามารถไปดูได้ที่ https://jekyll.mildronize.com/


ได้ 99 คะแนนจาก Google Insights & เรียนรู้การทำ web optimization ผ่านการพัฒนาเว็บบล็อกให้ทันสมัย
จากการพัฒนา [blog version แรก](<https://mildronize.com/notes/my-blog-dev/>)  ซึ่ง clone theme Hyde ของ [Jekyll](https://jekyllrb.com/) มาแล้วปรับแก้มาเรื่อยๆ

![old web design](https://www.dropbox.com/s/sqk4d1no2xi4os0/2018-09-17-99-score-google-insight-web-optimization-1.jpg?raw=1)
![new web deisgn](https://www.dropbox.com/s/gt0p9ta4da7t6gs/2018-09-17-99-score-google-insight-web-optimization-2.jpg?raw=1)

ตอนแรกไปลองใช้ [GatsbyJS](https://gatsbyjs.org/) อยู่สักพัก ซึ่งใช้ React ทั้งระบบเลย แต่สุดท้ายก็ย้ายจาก Gatsby กลับมาใช้ Jekyll เหมือนเดิม เท่าที่ลองใช้งานดู Gatsby เร็วกว่าในหลายๆ ด้านเลย ทั้งด้าน dev และ รันขึ้น production เป็น pwa ด้วย

แต่ดูเหมือนต้องปรับจูนเยอะกว่าจะได้ blog แบบที่เราต้องการ เลยไม่เอาดีกว่า ยอมใช้ Jekyll ที่ compile ช้ากว่า แต่ เราถนัดกว่า ( เทคโนโลยี แบบดั้งเดิมดี ไม่ต้องเปลี่ยนเยอะ)

> ตรงนี้จากประสบการณ์ตัวเอง เนื่องจากว่าเว็บบล็อกไม่ได้เขียนโค้ด หรือพัฒนาอยู่บ่อยๆ ส่วนใหญ่เน้นไปที่เขียนบทความใหม่ๆ มากกว่า ดังนั้น เมื่อเวลาผ่านไปนานๆ และเทคโนโลยีฝั่งเว็บไปเร็วมาก จนบางครั้งอาจจะทำให้เทคโนโลยีเว็บเดิมที่เคยใช้อยู่ทำงานไม่ได้ ใน browser สมัยใหม่ หรือการปรับเปลี่ยนให้ทันยุคทันสมัยต้องมานั่งแก้เว็บใหม่อีก
>
> **ดังนั้น** ผมเลยตัดสินใจใช้เทคโนโลยีเก่าหน่อย ที่ยังคงเป็น long term support แต่ก็ยังคงสามารถทำให้ดูทันสมัยได้ และไม่ได้ทำงานช้าด้วยซึ่งก็เหมาะสมกับเว็บบล็อกดี

สุดท้ายก็ตัดสินใจจูน frontend ของบล็อกเดิม ที่เป็น Jekyll ใหม่ให้เป็น Responsive มากขึ้น ทั้งแง่ของ typography ด้วย

----

## ผลการทดสอบจาก google insights
จากการทดสอบ google insights ก็ได้ 99 คะแนนบน mobile และ 97 คะแนนบน desktop

- ![99 score on Mobile](https://www.dropbox.com/s/2irrnt11wei4aq7/2018-09-17-99-score-google-insight-web-optimization-3.jpg?raw=1)
- ![97 score on Desktop](https://www.dropbox.com/s/k6ib5pfgunc6dr0/2018-09-17-99-score-google-insight-web-optimization-4.jpg?raw=1)

## ปรับปรุงเว็บเทคโนโลยีเก่าให้ทันสมัย

หลักๆ ที่ปรับจูน Web สมัยเก่าให้ดูดี ทันสมัย และเร็วด้วย

- เปลี่ยน core เป็น Bulma framework ทั้งหมด ทำให้ชีวิตการทำ responsive ง่ายขึ้น

- เปลี่ยนจากการโหลด CSS แบบ Synchronous (Blocking) ให้โหลดแบบ Async ใช้ไลบรารี่ [LoadCSS](<https://github.com/filamentgroup/loadCSS>) (ซึ่งแนะนำโดย Google Insights) ในการโหลด CSS เข้ามา เมื่อโหลดเสร็จ

### ผลที่ได้คือ

หน้าเว็บโหลดเร็วขึ้น แต่ข้อเสียคือ มันจะเห็นหน้าตาเว็บแบบไม่มี css ใดๆ เลย ซึ่งไม่สวยเลย 55 พอ CSS โหลดเข้ามาหน้าตาเว็บก็เป็นแบบที่เห็น แบบนี้เลยคับ

![load-css-async](https://www.dropbox.com/s/vks0ebprrdansm7/2018-09-17-99-score-google-insight-web-optimization-5.gif?raw=1)

- การใช้ **sass** ช่วยทำให้ชีวิตง่ายขึ้นเยอะในการจัดการค่าต่างๆ ในการตกแต่งหน้าเว็บ ให้มันเป็นอันหนึ่งอันเดียวกัน (consistency)

## ใช้ Jekyll sass plugin ในการ bundle sass และ css

(อนาคตจะไปใช้ webpack ด้วย) แยกเป็น 2 ไฟล์คือ

- `preload_styles.css` ไฟล์นี้ ถ้าโหลดผ่าน `LoadCSS` จะเหมือนรูปข้างบน จะใส่แบบปกติ ก็เดี๋ยวโดน Google หักคะแนน หาว่าโหลด stylesheet แบบ Blocking เดี๋ยวทำให้เว็บช้า **สรุปคือ** จัดการฝั่งโค้ด CSS เข้าไปใน HTML ซะเลย
- `postload_styles.css` ไฟล์นี้โหลดผ่าน `LoadCSS `ไฟล์นี้จะเป็น พวก asset ขนาดใหญ่ พวกโหลด font, กับ Icon ต่างๆ ([Font Awesome](https://fontawesome.com/)) ซึ่งไม่จำเป็นต้องมาก่อนครั้งแรกที่เว็บโหลดก็ได้

## เปลี่ยนเทคโนโลยีหน้า Search

จาก AngularJS ซึ่ง[เขียนตั้งแต่ปี 2558](https://github.com/mildronize/mildronize.github.io/commit/831f4fb466d0f9cd513a45c299b946ca2f398aed) ให้เป็น React โดยเป็นการใช้ React แบบ library จริงๆ คือเฉพาะส่วนของ content เท่านั้นที่เป็น React ที่เหลือยังคงเป็น HTML ธรรมดา (Header, Footer) ซึ่ง bundle ใส่ในไฟล์ `search.js` ปรับหน้า search ให้เป็น responsive บน mobile แยกต่างหากด้วย

![search](https://www.dropbox.com/s/3d4vqbnd424wbsh/2018-09-17-99-score-google-insight-web-optimization-6.jpg?raw=1)

## ทำเว็บ Bundle ด้วย Webpack4
เนื่องจากเป็น Static page ธรรมดา ไม่มีการทำ SPA แต่อย่างใด ดังนั้นเลยใช้การแพ็กเป็น bundle ( คือรวมทุกๆ ไฟล์ เข้ามาเป็นไฟล์เดียว หรือแบ่งเป็นหลายๆ ส่วนแล้วแต่โมดูลก่อนก็ได้ ) ซึ่ง [webpack](https://webpack.js.org/) ก็มาตอบโจทย์ตรงนี้ได้ เพื่อให้ลดจำนวน request ส่งไปยัง server ตอนนี้เว็บแบ่งออกเป็น 3 ไฟล์ (entry)

- `index.js` โหลดเฉพาะหน้าแรกเท่านั้น เป็นการเรียกใช้ [Moment.js](https://momentjs.com/) ( [Optimize file size ของ Moment ด้วยไม่งั้นไฟล์อ้วนมาก](https://github.com/jmblog/how-to-optimize-momentjs-with-webpack)) ในการแปลงเวลาของแต่บล็อก ให้แสดงผลว่า บล็อกเขียนมาแล้วกี่วัน
- `toc.js` โหลดเฉพาะหน้าที่มี Table of Content จ้า มี JQuery กับ [Jekyll ToC](https://github.com/ghiculescu/jekyll-table-of-contents)
- `search.js`โหลดเฉพาะหน้า Search เท่านั้น ซึ่งใช้ React ในหัวข้อก่อนหน้านี้

## [Lazy load image](<https://github.com/verlok/lazyload>)
คือไม่ได้โหลด รูปทุกรูปในครั้งแรกที่เว็บโหลดแต่ จะค่อยๆ โหลดเมื่อ user scroll ผ่านเท่านั้น เพื่อลดปริมาณข้อมูลที่โหลดทั้งหมด

สุดท้ายทำ

## โหลดรูปภาพแบบ เบลอก่อนแล้วเมื่อรูปโหลดเสร็จถึงจะแสดงรูปจริงแบบ [medium.com](http://medium.com/)
(ตรงนี้จะแชร์ในอีกบล็อกครับ) ซึ่งตรงนี้ใช้บริการแคชรูปของ [Cloudimage.io](https://cloudimage.io/) ซึ่งทำ cache, thumbnail ได้ง่ายมากๆ แถมให้ใช้ฟรี ตั้ง 15 GB ตรงนี้เขียน Plugin ของ Jekyll เข้ามาช่วยในการแปลง img tag ให้เป็นแบบ เบลอก่อนโหลดเสร็จด้วย

  ![image-load-blur](https://www.dropbox.com/s/4t30cmbtezs3qbw/2018-09-17-99-score-google-insight-web-optimization-7.gif?raw=1)

----

## สรุป สิ่งได้เรียนรู้จาก Google Insights

1. ให้คำแนะนำละเอียดมาก แนะนำว่าเว็บเรามีปัญหาตรงไหนแล้ว ควรจะแก้ยังไง
2. เหมาะสำหรับทดสอบเว็บแบบ responsive มีคะแนนแยกในส่วนของ mobile และ desktop
3. server response time ควรจะเร็ว ถ้าช้าจะหักคะแนนตรงนี้ไปเยอะ
4. Blocking rendering หรือ Synchronous rendering ตรงถ้า เอาส่วนตรงนี้ออกไปได้เว็บจะโหลดเร็วขึ้น และได้คะแนนเพิ่มด้วย
5. Minify HTML, JS , CSS ตรงนี้ถ้า ถ้าบีบไฟล์ source ได้เว็บจะโหลดเร็วขึ้นด้วย และไม่ถูกหักคะแนน
6. image compression ไม่จำเป็นเท่าไหร่นัก ถ้าดูจาก weight คะแนนของ insights แล้ว ถือว่าน้อยมาก แต่ถ้าทำด้วยจะดีมาก
7. redirect page ไปมา ทำให้คะแนนตกจ้า เว็บก็โหลดช้า
8. *** แถมการลดจำนวน request ไปยัง resource ต่างๆ ช่วยให้เว็บโหลดเร็วขึ้นด้วย ตรงนี้เราสามารถใช้ [webpack](https://webpack.js.org/) ช่วย bundle ได้ เพื่อรวมหลายๆ ไฟล์ is รวมเป็นไฟล์เดียว

## สิ่งที่จะทำต่อไป

- ตอนนี้ยังใช้บน IE แล้วยังมีปัญหา เรื่องของ Image Loading

Source code: https://github.com/mildronize/mildronize.github.io

แล้วพบกันใหม่ สวัสดีครับ


---

 *Cross published at [Medium.com](https://medium.com/@mildronize/%E0%B9%84%E0%B8%94%E0%B9%89-99-%E0%B8%84%E0%B8%B0%E0%B9%81%E0%B8%99%E0%B8%99%E0%B8%88%E0%B8%B2%E0%B8%81-google-insights-%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%A3%E0%B8%B9%E0%B9%89%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B8%B3-web-optimization-9b835aeac9b)*
