+++
title = "Run C# scripts ไฟล์เดียว โดยใช้ .NET CLI"
date = "2021-09-04"

[taxonomies]
categories = [ "Dotnet" ]
tags = [ "Dotnet", "Dotnet5", "Dotnet-script" ]

[extra]
id = "t2z614m"
unsplashImgCoverId = "EzUZqqp_yrc"
+++

วิธีการรัน C# ไฟล์เดียวโดยที่ไม่ต้องสร้างเป็นโปรเจ็คโดยใช้
.NET CLI

เนื่องจากได้รู้จักกับ [LeetCode](https://leetcode.com/) เว็บสำหรับฝึกฝนทักษะการเขียนโปรแกรม โดยที่มีหลายภาษามากๆ และแน่นอนมีภาษา C# ด้วย

## 1. ติดตั้ง

แค่ติดตั้ง dotnet-script โดยใช้คำสั่ง

```bash
dotnet tool install -g dotnet-script
```

## 2. สร้างไฟล์ omnisharp.json

```json
// Filename: omnisharp.json
{
  "script": {
    // เพื่อให้รู้ว่าเราจะเขียน dotnet แบบ script
    "enableScriptNuGetReferences": true,
    // ใช้ .net 5
    "defaultTargetFramework": "net5.0"
  }
}
```

> ถ้าเราใช้คำสั่ง `dotnet script init` จะสร้างไฟล์ `omnisharp.json` แบบนี้ให้อัตโนมัติเลย

## 3. เขียนไฟล์ที่ต้องการรัน

```csharp
// Filename: HelloWorld.csx
public class HelloWorld {
    public string GetString() {
        return "Hello World";
    }
}

Console.WriteLine(new HelloWorld().GetString());
```

ถ้าเราสังเกตุเราสามารถเขียนคำสั่งนอก Class ได้เลย ซึ่งสะดวกมากๆ สำหรับการเขียน script

> ใน Docs เค้าแนะนำให้ใช้ `.csx` เพราะว่าจะได้แยกแยะออกว่าอันนี้คือ scripts

### โครงสร้างไฟล์ควรเป็นแบบนี้

```
.
├── HelloWorld.csx
└── omnisharp.json
```

## 4. แล้วรันได้เลย

```bash
$ dotnet-script .\HelloWorld.csx
Hello World
```

## Tip: สร้าง scripts เป็น folder

เราสามารถใช้ โดยการสร้าง Folder ไว้แล้ว รันคำสั่งใน Folder นั้นเลย

```bash
dotnet script init
```

This will create `main.csx` along with the launch configuration needed to debug the script in VS Code.

```
.
├── .vscode
│   └── launch.json
├── main.csx
└── omnisharp.json
```

## Ref
https://github.com/filipw/dotnet-script
