+++
title = "วิธีการ Import Terraform State ใน Terraform Cloud"
date = "2023-08-07"

[taxonomies]
categories = [ "Terraform" ]
tags = [ "Terraform", "Terraform Cloud" ]

[extra]
id = "hye03ea"
+++

> Terraform v1.5.2

## ปัญหา 

เวลาเราใช้งาน Terraform Cloud มันจะมีประเด็นอยู่คือ Terraform ไม่ให้เรา Import Resource ใหม่ถ้าเราใช้ Variable ที่เป็น Secret ที่อยู่บน Terraform Cloud 

## วิธีแก้เบื้องต้น

1. รันคำสั่ง เพื่อดึง State ที่อยู่บน Cloud ลงมาที่ local ก่อน
   ```bash
   terraform state pull > terraform.tfstate
   ```
   
2. ลบโฟลเดอร์ `.terraform` เพราะว่าเรามีการเชื่อมต่อกับ Terraform Cloud ไว้แล้ว (หมายถึงเก็บ Terraform State ที่ Terraform Cloud)

    ```bash
    rm -rf .terraform
    ```
3. ให้ comment ส่วนของ block `cloud` ไว้ก่อน (Remote State) ยกตัวอย่าง Code ข้างล่างผมใช้ provide [azurerm](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
    ```hcl
    terraform {
      required_version = ">= 1.5.2"
      required_providers {
        azurerm = {
        source  = "hashicorp/azurerm"
        version = "~> 3.58"
        }
      }

      # cloud {
      #   organization = "your-organization"
      #   workspaces {
      #     name = "my-terraform"
      #   }
      # }
    }

    provider "azurerm" {
      features {}
    }
    ```
4. สั่ง `terraform init` เพื่อเริ่มต้นติดตั้ง module ใหม่ทั้งหมด พอไม่มี block `cloud` terraform จะไปใช้งาน local state ซึ่งนั้่นก็คือไฟล์ `terraform.tfstate` ที่เราดาวน์โหลดลงมาในข้อ 1.
    ```bash
    terraform init
    ```
5. สั่ง `terraform state list` เพื่อดูว่ามี State อยู่ที่ Local จริงๆ นะ

    ```bash
    terraform state list
    ```
   
6. จากนั้นให้เริ่ม import resource ตามที่เราต้องการ เช่น ผมจะ import resource ที่ชื่อ [azurerm_linux_web_app](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_web_app#import) ก็สามารถใช้ Syntax import ได้ตามปกติ
    ```bash
    terraform import azurerm_linux_web_app.example /subscriptions/12345678-1234-9876-4563-123456789012/resourceGroups/resGroup1/providers/Microsoft.Web/sites/site1
    ```
7. จากนั้นสั่ง `terraform state list` เพื่อดูว่าที่ import เข้ามาอยู่ใน State แล้วหรือยัง

    ```bash
    terraform state list
    ```
8. ให้เอา comment ออกในส่วนของ `cloud` (Remote State)
    ```hcl
    terraform {
      required_version = ">= 1.5.2"
      required_providers {
        azurerm = {
        source  = "hashicorp/azurerm"
        version = "~> 3.58"
        }
      }

      cloud {
        organization = "your-organization"
        workspaces {
          name = "my-terraform"
        }
      }
    }

    provider "azurerm" {
      features {}
    }
    ```
9.  ลบโฟลเดอร์ `.terraform` เพราะว่าเรามีการเชื่อมต่อใช้ Terraform State อยู่ใน Local ไว้อยู่

    ```bash
    rm -rf .terraform
    ```
10. สั่ง `terraform init` เพื่อเริ่มต้นติดตั้ง module ใหม่ทั้งหมด พอมี block `cloud` (Remote State) มันก็จะต่อไปที่ Terraform Cloud อีกครั้ง
    ```bash
    terraform init
    ```

    ซึ่งในขั้นตอนนี้ Terraform จะข้อความมายาวๆ เพื่อถามว่าจะให้ Terraform State บน Local ไปทับ State บน Cloud มั้ย (แนะนำให้ Backup local state ไว้ก่อนทุกครั้ง) จากนั้นให้กด Yes เพื่อเริ่มทำงาน

Ref: https://github.com/hashicorp/terraform/issues/26494

แอบเหนื่อยนิดนึง แต่ก็แก้ปัญหาได้นะ ใครมี Solution ดีๆ มา share กันได้นะ