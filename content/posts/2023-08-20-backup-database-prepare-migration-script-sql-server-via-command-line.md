+++
title = "วิธี Backup Database และเตรียม Migration Script บน SQL Server ด้วย command line"
date = "2023-08-20"

[taxonomies]
categories = [ "Database" ]
tags = [ "Database", "Migration", "SQL Server", "MSSQL" ]

[extra]
uuid = "h10x942"
unsplashImgCoverId = "lRoX0shwjUQ"
+++

> หมายเหตุ บทความนี้ Draft ไว้ตั้งแต่วันที่ Sep 20, 2021 ถ้ามีเนื้อหาไหนที่ไม่ได้ Up-to-date ก็สามารถแจ้งได้เลยนะครับ

สวัสดีครับ! วันนี้เรามีข้อมูลน่าสนใจเกี่ยวกับโปรแกรม [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15) และ [SQL Server Data Tools (SSDT)](https://learn.microsoft.com/en-us/sql/ssdt/sql-server-data-tools?view=sql-server-ver16) ที่จะมาแนะนำให้คุณรู้จักเพิ่มเติมเกี่ยวกับวิธีการใช้งานเบื้องต้น สำหรับการจัดการฐานข้อมูล SQL Server อย่างสะดวกและง่ายดายโดยไม่ต้องใช้คำสั่ง command line อันซับซ้อนนะครับ!

เริ่มต้นจาก SQL Server Management Studio (SSMS) ซึ่งเป็นโปรแกรมที่ช่วยให้คุณจัดการกับข้อมูลใน SQL Server ได้อย่างสะดวก คุณสามารถดาวน์โหลด SSMS ได้จาก ที่นี่ นะครับ.

นอกจากนี้ยังมี SQL Server Data Tools (SSDT) ที่มาช่วยเพิ่มความสะดวกในการจัดการฐานข้อมูล SQL Server ด้วยครับ โดยคุณสามารถตั้งค่าสภาพแวดล้อมการทำงานของ SSDT ได้ที่ `C:\Program Files\Microsoft SQL Server\150\DAC\bin` นะครับ.

ต่อไปเรามาดูวิธีการ Export ข้อมูลและ Schema กันครับ คุณสามารถทำเหมือนกับการ Export a Data-tier Application ใน SSMS ได้โดยใช้คำสั่ง PowerShell ซึ่ง Extension ไฟล์ที่ได้จะเป็น `.bacpac` ดังนี้:


```powershell
sqlpackage /Action:Export /SourceConnectionString:"Data Source=.\SQLEXPRESS; Initial Catalog=TestDB; Integrated Security=True" /TargetFile:"D:\auto-deployment\database_backup.bacpac"
```

หลังจากนั้นถ้าคุณต้องการ Import ข้อมูลนี้เข้าสู่ระบบอื่น ๆ คุณสามารถใช้คำสั่ง PowerShell ต่อไปนี้:

```powershell
sqlpackage /Action:Import /TargetConnectionString:"Data Source=.\SQLEXPRESS; Initial Catalog=Imported_TestDB; Integrated Security=True" /SourceFile:"D:\auto-deployment\database_backup.bacpac"
```

นอกจากนี้ยังมีการดึง Schema อย่างเดียวไม่รวม Data ไปใช้งานด้วยคำสั่ง Extract โดย Extension ไฟล์ที่ได้จะเป็น `.dacpac`` นะครับ:

```powershell
sqlpackage /Action:Extract /SourceConnectionString:"Data Source=.\SQLEXPRESS; Initial Catalog=TestDB; Integrated Security=True" /TargetFile:"D:\auto-deployment\database_schema.dacpac"
```

หากคุณต้องการสร้างรายงาน Diff Report ระหว่าง Schema คุณสามารถใช้คำสั่ง DeployReport ดังนี้ โดย SourceFile ต้องเป็น `dacpac`:

```powershell
sqlpackage /Action:DeployReport /OutputPath:"D:\auto-deployment\report.xml" /OverwriteFiles:True /SourceFile:"D:\auto-deployment\TestDatabase\Snapshots\TestDatabase_20210916_17-58-02.dacpac" /TargetConnectionString:"Data Source=.\SQLEXPRESS; Initial Catalog=TestDB; Integrated Security=True"
```

และสุดท้าย หากคุณต้องการสร้างสคริปต์สำหรับการเคลื่อนย้ายข้อมูล คุณสามารถใช้คำสั่ง Script ดังนี้:

```powershell
sqlpackage /Action:Script /OutputPath:"D:\auto-deployment\migration.sql" /OverwriteFiles:True /SourceFile:"D:\auto-deployment\TestDatabase\Snapshots\TestDatabase_20210916_17-58-02.dacpac" /TargetConnectionString:"Data Source=.\SQLEXPRESS; Initial Catalog=TestDB; Integrated Security=True"
```

## แหล่งอ้างอิง และศึกษาเพิ่มเติม

[https://www.mssqltips.com/sqlservertip/4759/sql-server-database-schema-synchronization-via-sqlpackageexe-and-powershell/](https://www.mssqltips.com/sqlservertip/4759/sql-server-database-schema-synchronization-via-sqlpackageexe-and-powershell/)

[https://stackoverflow.com/questions/20673516/command-line-api-for-schema-compare-in-ssdt-sql-server-database-project](https://stackoverflow.com/questions/20673516/command-line-api-for-schema-compare-in-ssdt-sql-server-database-project)

How to: Create a New Database Project: [https://docs.microsoft.com/en-us/sql/ssdt/how-to-create-a-new-database-project?view=sql-server-ver15](https://docs.microsoft.com/en-us/sql/ssdt/how-to-create-a-new-database-project?view=sql-server-ver15)

