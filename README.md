
# Blog / Content Platform API

โปรเจกต์นี้คือ Backend API สำหรับระบบจัดการบล็อกและคอนเทนต์ (Blog / Content Platform) ซึ่งพัฒนาขึ้นโดยใช้สถาปัตยกรรมแบบ Object-Oriented Programming (OOP) เพื่อเป็นโครงงานรายวิชา (OOP Final Project) 

ระบบครอบคลุมการทำงานพื้นฐานแบบครบวงจร (CRUD Operations) และมีการจัดการความสัมพันธ์ของข้อมูล (Business Logic) ระหว่าง ผู้ใช้งาน (Users), โพสต์ (Posts) และ ความคิดเห็น (Comments) อย่างเป็นระบบ

---

## Project Overview (ภาพรวมโปรเจกต์)
ระบบ Backend นี้ถูกออกแบบมาให้รองรับการจัดการข้อมูลหลัก 3 ส่วน:
1. **Users Module:** ระบบจัดการผู้ใช้งาน รวมถึงการลบข้อมูลแบบ Cascade (หากลบ User ระบบจะตามลบ Post และ Comment ของ User นั้นออกทั้งหมด)
2. **Posts Module:** ระบบจัดการบทความ/โพสต์ มีการจัดการสถานะโพสต์ (DRAFT, PUBLISHED, ARCHIVED)
3. **Comments Module:** ระบบจัดการความคิดเห็น ซึ่งมี Business Logic ป้องกันการคอมเมนต์ในโพสต์ที่ยังไม่ถูกเผยแพร่ (Unpublished posts)

**รายชื่อสมาชิกผู้จัดทำ:**
* ปาน์ณบดี พานิชกิจ (68010697)
* ปุณณวิช กำธร (68010713)
* วริทธิ์นันท์ ใบบัว (68011000)
* วิภูสรรพ์ จุ่นพิจารณ์ (68011031)

---

## Technology Stack 
* **Framework:** [NestJS](https://nestjs.com/) (Node.js Framework)
* **Language:** TypeScript
* **API Documentation:** Swagger)
* **Validation:** `class-validator` และ `class-transformer` (สำหรับตรวจสอบข้อมูล DTO)
* **Database/Storage:** JSON File System (จัดเก็บข้อมูลจำลองในโฟลเดอร์ `data/`)

---

## 🚀 วิธีการติดตั้งและรันโปรเจค

**1. Clone โปรเจกต์ลงมาที่เครื่อง:**
```bash
git clone https://github.com/Panabordee/OOP-Finalproject.git
cd OOP-Finalproject

2. ติดตั้ง Dependencies:

npm install

3. รันเซิร์ฟเวอร์ (โหมด Development):

npm run start:dev

4. การทดสอบ API (Swagger UI):
เมื่อเซิร์ฟเวอร์รันสำเร็จ สามารถเปิดดู API Documentation และทดสอบ API ได้ผ่านเบราว์เซอร์ที่:
👉 http://localhost:3000/api
📁 โครงสร้างโปรเจคโดยสรุป

โปรเจกต์ถูกแบ่งออกเป็นโมดูลต่างๆ 
src/
├── app.controller.ts       # จุดเริ่มต้นของ API (Root Route)
├── app.module.ts           # รวบรวม Module ทั้งหมดของระบบ
├── main.ts                 # ไฟล์ตั้งต้นของโปรเจกต์ (Setup Swagger)
│
├── common/                 # โฟลเดอร์เก็บของที่ใช้ร่วมกันทั้งโปรเจกต์
│   ├── enums/              # เช่น PostStatus (DRAFT, PUBLISHED)
│   ├── interfaces/         # เช่น ApiResponse, BaseEntity
│   └── utils/              # ฟังก์ชันช่วยเหลือ เช่น สร้าง UUID, เวลา
│
└── modules/                # โฟลเดอร์เก็บ Business Logic หลัก
    ├── comments/           # Module จัดการความคิดเห็น (Controller, Service, DTO, Entity)
    ├── post/               # Module จัดการโพสต์
    └── users/              # Module จัดการผู้ใช้งาน

(หมายเหตุ: ข้อมูลจะถูกบันทึกอัตโนมัติลงในโฟลเดอร์ data/ ในรูปแบบไฟล์ .json เมื่อมีการทำ CRUD Operations)
📚 เอกสารอ้างอิงและอัปเดต (Documentation)

    📄 API Specification Document - รายละเอียด Endpoints, Request/Response Format และ HTTP Status Codes

👉 คลิกที่นี่เพื่อไปยังโฟลเดอร์ docs/
    📂 เปิดโฟลเดอร์เอกสารทั้งหมด (docs/)

    📜 ดูรายละเอียด API Specification
    (./docs/api-specification.md)
