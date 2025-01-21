+++
title = "ออกแบบการใช้ API Key อย่างปลอดภัย โดยใช้ Azure Table เป็นกรณีศึกษา"
date = "2025-01-21"

[taxonomies]
categories = [ "API" ]
tags = [ "API", "Security", "System Design", "Azure", "Azure Table" ]

[extra]
id = "1fpztz1"
+++


วันก่อนไปนั่งแกะ Authentication ของ Azure table มาเลย ว่าเวลาที่เค้ายืนยันตัวตน ผ่าน API เค้าทำยังไง แล้วก็เจอว่าเค้าใช้ เค้าใช้ Signature คู่กับ Access Key และบังเอิญโพสของ [Alex Xu ใน X](https://x.com/alexxubyte) ว่าด้วยเรื่องของ ["How do we design effective and safe APIs?"](https://x.com/alexxubyte/status/1881034986561982952?t=u2PahKOS7wvncXHEorTJzQ&s=19) ซึ่งอธิบายเรื่องนึงที่ผมสังเกตุเห็นก็คือ

```diff
Secure Access API

- GET /api/private
- Header: X-API-KEY: <API_KEY>

+ Header: X-API-KEY: <API_KEY>
+         X-EXPIRY: <API_KEY>
+         X-REQUEST-SIGNATURE: hmac(URL + Query + Expiry + Body)
```

ที่นี้เรามาดูกันดีกว่าว่าทำไม  [Alex Xu](https://x.com/alexxubyte) ถึงแนะนำออกแบบไม่ให้ส่ง API KEY ไปตรงๆ แบบโจ่งแจ้งแบบนั้น

ยกตัวอย่าง เวลาที่เราพัฒนาระบบระบบนึง เช่น E-commerce API อย่างเรามี API สำหรับการสร้างออเดอร์หรือดูรายละเอียดสินค้า หลายคนอาจเลือกใช้ API Key ในการยืนยันตัวตน เพราะมันใช้งานง่าย แค่ใส่ API Key ลงใน header เช่น `X-API-KEY` ระบบก็ทำงานได้ทันที แต่การใช้แค่ API Key อย่างเดียวกลับมีความเสี่ยงที่ในหลายๆ มิติ เราไปดูกัน

## ตัวอย่างปัญหาใน API
สมมติเราออกแบบ API สำหรับร้านค้าออนไลน์ โดย API มีฟังก์ชันสำคัญ เช่น:

สร้างคำสั่งซื้อ:

```
POST /api/orders
Header: X-API-KEY: <API_KEY>
Body: { "productId": 123, "quantity": 1 }
```
หาก API Key รั่วไหล ผู้ไม่หวังดีอาจสร้างคำสั่งซื้อปลอมในระบบ ส่งผลให้สต็อกสินค้าและการจัดการคำสั่งซื้อผิดพลาด

### ปัญหาของการใช้แค่ API Key

1. **API Key สามารถถูกขโมยได้**
    
    ถ้าเราส่ง API Key ผ่านอินเทอร์เน็ตโดยไม่มีการเข้ารหัส เช่น ใช้ HTTP แทน HTTPS ผู้ไม่หวังดีสามารถดักจับ (sniffing) API Key ของเราไปใช้งานต่อได้ทันที ซึ่งถ้าระบบของเราไม่มีวิธีป้องกันเพิ่มเติม มันก็เหมือนเราให้ "กุญแจบ้าน" กับคนอื่นไปเลย หรือบางครั้งเราใส่ API KEY ไปที่ Query Params โดยตรงซึ่งเราอาจจะถูกดักจับได้จากพวก Router หรือพวก ISP ได้ครับ เช่น `GET /api/orders?key=XXXX`
    
2. **Replay Attacks**
    
    การใช้ API Key อย่างเดียว ทำให้ผู้โจมตีสามารถเอา Request เดิมๆ ของเรามาใช้อีกครั้งได้ เพราะ API Key ไม่ได้ผูกกับข้อมูลเฉพาะของ Request นั้นๆ เช่น เวลา (timestamp) หรือรายละเอียดของ Request 
    
3. **ตรวจสอบความถูกต้องไม่ได้**
    
    API Key ไม่สามารถบอกได้ว่า ข้อมูลใน Request นั้นถูกแก้ไขระหว่างทางหรือเปล่า เพราะมันไม่มีการลงนาม (signature) เพื่อยืนยันความถูกต้อง
    
### ทำไมต้องใช้ Signature?

**Signature** คือ "ลายเซ็นดิจิทัล" ที่สร้างจากข้อมูลที่เราต้องการ เช่น ใน Request เราอาจจะใช้ URL, เวลา, และ Request Body โดยเข้ารหัส (hashed) ด้วย **Secret Key** ซึ่งมันช่วยให้การยืนยันตัวตนปลอดภัยขึ้นมาก

1. **ป้องกันการปลอม Request**
    
    เพราะ Signature ถูกสร้างขึ้นจากข้อมูลเฉพาะของ Request  เช่น URL และเวลา หากไม่มี Secret Key ก็ไม่มีทางสร้าง Signature ที่ถูกต้องได้
    
2. **ป้องกัน Replay Attacks**
    
    การใช้ Timestamp (เช่น `x-ms-date`) ช่วยให้ Signature มีอายุจำกัด ถ้า Request ถูกส่งซ้ำหลังเวลาที่กำหนด  Request นั้นจะถูกปฏิเสธทันที
    
3. **มั่นใจได้ว่าข้อมูลไม่ถูกแก้ไข**
    
    Signature ยืนยันได้ว่าข้อมูลใน Request ไม่ได้ถูกดัดแปลงระหว่างทาง เพราะ Signature จะเปลี่ยนทันทีหากข้อมูลเปลี่ยน

### การใช้ Signature เพื่อแก้ปัญหา
การเพิ่ม Signature ในการยืนยันตัวตนช่วยให้ Request แต่ละ Request ปลอดภัยยิ่งขึ้น ตัวอย่างเช่น ในระบบ E-commerce เราอาจออกแบบให้ Request  POST หรือ PUT ต้องมี Signature แบบนี้ ในตัวอย่างข้างล่างเป็นแค่แนวคิด Algorithm ซึ่งสามารถนำไปประยุกต์ใช้ได้ทุกภาษา:

1. สร้างข้อความที่ต้องการจะ Sign รวมข้อมูลสำคัญใน Request  เช่น HTTP Method, URL, Timestamp และ API Key อย่างเช่น:
	
	```ts
	stringToSign = "POST\n/api/orders\nx-timestamp:2025-01-21T10:00:00Z\nproductId=123&quantity=1"
	```
1. สร้าง Signatureใช้ HMAC-SHA256 เข้ารหัส String to Sign ด้วย Secret Key (โดยที่ HMAC คือการเข้ารหัส Signature ด้วย Algorithm อะไรก็ได้ที่เป็น Hash function พร้อมกับ Secret:

    ```ts
    signature = hmac("sha-256", stringToSign, secretKey)
    ```

3. แนบ Signature ใน Request ส่ง Signature และ Timestamp ไปใน header:

    ```
    POST /api/orders
    Headers:
    X-API-KEY: <API_KEY>
    X-TIMESTAMP: 2025-01-21T10:00:00Z
    X-SIGNATURE: <Signature>
    ```

4. ตรวจสอบ Signature ที่ฝั่งเซิร์ฟเวอร์ เซิร์ฟเวอร์จะสร้าง Signature ใหม่จาก Request ที่ได้รับ และตรวจสอบว่าตรงกับ Signature ที่ผู้ใช้ส่งมาหรือไม่ หากไม่ตรงกัน  Request จะถูกปฏิเสธทันที แสดงว่าเราควรเก็บ Secret ให้ดี ดังนั้นเราไม่ควร Sign พวก Signature ที่ Browser เพราะเราสามารถเปิด source code เพื่อดู Secret ได้

## ตัวอย่างจาก Azure Storage Table

ที่นี้เรามาดูตัวอย่างของจริงกันบ้าง ใน Azure มีบริการนึงชื่อว่า Azure Table ซึ่งเป็น Serverless NoSQL Database ที่เป็นแบบ Table  ซึ่งเราสามารถเข้าถึง Data ของ Azure Table ได้

ซึ่ง [Azure Table สามารถยืนยันตัวตนและรับรองสิทธิของ Data ได้หลายวิธี](https://learn.microsoft.com/en-us/azure/storage/common/authorize-data-access?tabs=tables)) ซึ่ง **Shared Key Authorization** ก็เป็นวิธีการรับรองสิทธิ์ที่ใช้สำหรับการเข้าถึงข้อมูลใน **Azure Storage** ซึ่งรองรับบริการต่าง ๆ เช่น Blobs, Files, Queues และ Tables โดยการทำงานจะเป็นดังนี้:

เมื่อไคลเอนต์ (Client) ต้องการส่งคำขอ (Request) ไปยัง Azure Storage จะต้องแนบ **Header** ที่ถูกเซ็นด้วย **Storage Account Access Key** ซึ่งเป็นคีย์ลับสำหรับการเข้าถึงบัญชีเก็บข้อมูล
ซึ่งเราสามารถดูวิธีการ [Authorize with Shared Key](https://learn.microsoft.com/en-us/rest/api/storageservices/authorize-with-shared-key/).

{% note(header="Note") %}
ซึ่งใน Azure Table เราสามารถเลือกใช้ได้ 2 บริการ ก็คือ Azure Storage Account ซึ่งจะมีบริการ Table อยู่ข้างใน หรือจะใช้ [Azure Cosmos Table](https://learn.microsoft.com/en-us/azure/cosmos-db/table/introduction) ก็ได้เหมือนกัน 
{% end %}

## ตัวอย่างการใช้งานจริงจาก Azure Table

ในตัวอย่างผมแกะมาจาก Scheme ที่เป็น  **Shared Key Lite** ซึ่งเป็นวิธีการ Authentication ไปยัง Azure Table วิธีการนึง [**Shared Key authorization**](https://learn.microsoft.com/en-us/rest/api/storageservices/authorize-with-shared-key) ซึ่งผมได้แกะมาจาก Source Code ของ Azure Table Client ที่อยู่ใน npm [@azure/data-tables@13.3.0](https://www.npmjs.com/package/@azure/data-tables) โดยตัวอย่างข้างล่างผมหยิบมาจากตัวอย่างโค๊ด [tablesNamedCredentialPolicy.ts](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/data-tables_13.3.0/sdk/tables/data-tables/src/tablesNamedCredentialPolicy.ts#L37-L64)

Azure Table Storage ใช้การยืนยันตัวตนแบบ **Shared Key Lite** โดยต้องสร้าง Signature จากข้อมูลใน Request  เช่น:

- `x-ms-date` (วันที่ใน Request )
- Canonicalized Resource (ข้อมูลทรัพยากร เช่น ชื่อตาราง)

ตัวอย่างโค้ดสร้าง Authorization Header:

```ts
const stringToSign = `${dateHeader}\n${getCanonicalizedResourceString(request, credential)}`;
const signature = computeHMACSHA256(stringToSign, credential.key);
const authorizationHeader = `SharedKeyLite ${credential.name}:${signature}`;
```

### วิธีการทำงาน:

1. **สร้าง String to Sign** รวมข้อมูลสำคัญ เช่น วันที่และข้อมูลทรัพยากร
2. **สร้าง Signature** ใช้ HMAC-SHA256 เพื่อเข้ารหัส String to Sign ด้วย Secret Key
3. **ตรวจสอบ Signature** ฝั่งเซิร์ฟเวอร์จะสร้าง Signature ใหม่จากข้อมูลใน Request ที่ได้รับ แล้วเปรียบเทียบกับ Signature ที่ส่งมาด้วย

{% note(header="Note") %}
ถ้าสังเกตุดีๆ จะเห็นว่า ตัวอย่างเรื่อง Signature ของ API Key ที่ยกตัวอย่างมา รวมถึงของทาง   [Alex Xu](https://x.com/alexxubyte) และ  Shared Key Authorization ของ Azure มีความต่างกันของ Header ที่จะส่งอยู่

1. โดยทั่วไปแล้ว API Key สามารถให้เห็นได้ เพราะเราอาจจะใช้หลาย Token แล้วจำนวนต้องบอกไปยัง Server ว่าเราใช้ API Key ไหน
2. แต่ในกรณีของ Azure เจ้า API Key หรือก็คือ Shared Key Authorization นั้น เป็นเหมือน Master Key ก็คือถ้าหลุดไป สามารถเข้าถึงได้เยอะมาก แต่มีได้แค่ Key เดียว ซึ่งฝั่ง Server จะรู้อยู่แล้วว่าต้องใช้ Key อะไรเอาไป Sign เพื่อเปรียบเทียบกัน

ดังนั้นเลือก และตัดสินใจวิธีการ Authentication ด้วยความเข้าใจ ขอบเขตของความปลอดภัย
{% end %}

## ทำไม Microsoft แนะนำให้เลิกใช้ Shared Key Authorization กับ Azure Storage?

อย่างไรก็ตาม ทาง Azure แนะนำให้เรา [ปิดการใช้งาน Shared Key authorization](https://learn.microsoft.com/en-us/azure/storage/common/shared-key-authorization-prevent)เพราะมันไม่เหมาะกับบริบทนี้ แต่ไม่ได้หมายความว่าการ Sign Signature แบบนี้จะไม่ปลอดภัยซะทีเดียว มันอยู่ที่เรารับระดับของความปลอดภัยได้มากน้อนแค่ไหน

**ทำไมการใช้ Shared Key Authorization ถึงต้องระมัดระวัง?**
- **ความสำคัญของ Access Key:** คีย์นี้เป็นเหมือนกุญแจหลัก (Master Key) ของบัญชีเก็บข้อมูล ถ้าคีย์นี้ตกไปอยู่ในมือคนอื่น ไม่ว่าจะด้วยความผิดพลาดหรือการโจมตีทางไซเบอร์ ผู้ที่ได้คีย์ไปจะสามารถเข้าถึงข้อมูลทุกอย่างในบัญชีของคุณได้ รวมถึงการลบหรือแก้ไขข้อมูล
- **ไม่มีการควบคุมแบบละเอียด (Limited Control**): การใช้ Shared Key ไม่สามารถกำหนดสิทธิ์เฉพาะเจาะจงให้ผู้ใช้แต่ละคนได้ เช่น การอนุญาตให้บางคนอ่านข้อมูลอย่างเดียว หรือให้สิทธิ์เฉพาะบางโฟลเดอร์

### สรุป

การใช้แค่ API Key อาจทำให้ระบบของเราถูกเจาะง่าย เช่น ถ้า API Key รั่วไหลไป ระบบของเราก็จะโดนใช้แบบไม่จำกัด การเพิ่ม Signature ช่วยให้ Request แต่ละ Request มีความเฉพาะตัว ป้องกันการปลอมแปลง ลดความเสี่ยงจาก Replay Attacks และยืนยันได้ว่า Request มาจากแหล่งที่ถูกต้อง เหมือนกับที่ Azure Table Storage ใช้วิธีนี้เพื่อความปลอดภัยของข้อมูล

ถามว่า ทำไมผมถึงยกตัวอย่างของ Azure Table เพราะ Shared Key Authorization คล้ายกับการใช้ **API Key** โดยเซ็นข้อความ (Sign Signature) ด้วย **HMAC (Hash-based Message Authentication Code)** ซึ่งมีการเข้ารหัสที่แข็งแรงอยู่แล้ว ถ้าคุณไม่ได้กังวลเรื่องความปลอดภัยมากนัก หรือเป็นระบบที่ไม่ได้เก็บข้อมูลสำคัญ Shared Key ก็อาจจะยังเป็นตัวเลือกที่เหมาะสมอยู่นะ

ดังนั้นเวลาเราออกแบบ เราควรจะเลือกวิธีการออกแบบให้เหมาะสมกับสถานการณ์นั้นๆ และการ Secure API Token ด้วย Signature ยังตอบโจทย์ในหลายสถานการณ์อยู่ครับ ถ้า Endpoint ของเราไม่ได้มีการ Shared การใช้งาน Resource ในลักษณะของ Azure Table ก็ยังถือว่าปลอดภัยอยู่ครับ 

แล้วพบกันใหม่นะครับ
