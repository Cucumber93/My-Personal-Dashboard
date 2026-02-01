# Docker Deploy Guide - My-Personal-Dashboard

## 🔧 การแก้ไข API URL สำหรับ Production

### ปัญหา
เมื่อ deploy ขึ้น server ผ่าน Docker แล้ว frontend ยังเรียก API ไปที่ `http://localhost:3100/api` ซึ่งไม่ถูกต้อง

### วิธีแก้ไข

#### 1. ใช้ Build Args ตอน Build

**Option A: ใช้ docker-compose.yml**

แก้ไข `docker-compose.yml`:
```yaml
dashboard:
  build:
    context: ./My-Personal-Dashboard
    dockerfile: Dockerfile
    args:
      VITE_API_URL: https://cucumber-dashboard.win/personal-api
      NODE_ENV: production
```

**Option B: ใช้ Environment Variable**

สร้างไฟล์ `.env` ใน root directory:
```env
VITE_API_URL=https://cucumber-dashboard.win/personal-api
```

แล้วรัน:
```bash
docker-compose build dashboard
docker-compose up -d dashboard
```

**Option C: ใช้ Build Script**

```bash
# Linux/Mac
export VITE_API_URL=https://cucumber-dashboard.win/personal-api
./docker-build-push.sh v1.0.0

# Windows
set VITE_API_URL=https://cucumber-dashboard.win/personal-api
docker-build-push.bat v1.0.0
```

#### 2. Rebuild Image

```bash
# Rebuild dashboard image
docker-compose build --no-cache dashboard

# หรือ rebuild ทั้งหมด
docker-compose build --no-cache

# Start services
docker-compose up -d
```

## 📝 สรุปการแก้ไข

### ไฟล์ที่แก้ไข

1. ✅ `My-Personal-Dashboard/Dockerfile`
   - เพิ่ม `ARG VITE_API_URL`
   - เพิ่ม `ENV VITE_API_URL=$VITE_API_URL`
   - ใช้ build args ตอน build

2. ✅ `docker-compose.yml`
   - ใช้ environment variable สำหรับ `VITE_API_URL`
   - Default: `https://cucumber-dashboard.win/personal-api`

3. ✅ `docker-build-push.sh` และ `docker-build-push.bat`
   - เปลี่ยน default API URL เป็น production URL

## 🚀 การ Deploy

### Local Development
```bash
# ใช้ localhost
docker-compose up -d
```

### Production
```bash
# ตั้งค่า API URL
export VITE_API_URL=https://cucumber-dashboard.win/personal-api

# Build และ Push
./docker-build-push.sh v1.0.0

# บน Production Server
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## ⚠️ สิ่งสำคัญ

1. **Vite Environment Variables** ถูก embed ตอน build time
   - ต้อง rebuild image ใหม่ทุกครั้งที่เปลี่ยน API URL
   - ไม่สามารถเปลี่ยน runtime ได้

2. **ตรวจสอบ API URL**
   - เปิด browser DevTools
   - ดู Network tab
   - ตรวจสอบว่า API calls ไปที่ URL ที่ถูกต้อง

3. **CORS Configuration**
   - ตรวจสอบว่า backend อนุญาต CORS จาก domain ของคุณ
   - ตรวจสอบ `Access-Control-Allow-Origin` header

## 🔍 Troubleshooting

### API calls ยังไปที่ localhost

1. ตรวจสอบว่า rebuild image แล้ว:
   ```bash
   docker-compose build --no-cache dashboard
   ```

2. ตรวจสอบ build args:
   ```bash
   docker-compose config
   ```

3. ตรวจสอบ environment variable:
   ```bash
   echo $VITE_API_URL
   ```

### Connection Refused

1. ตรวจสอบว่า API URL ถูกต้อง
2. ตรวจสอบว่า backend service ทำงานอยู่
3. ตรวจสอบ network connectivity

---

**ตอนนี้ Dockerfile รองรับ build args แล้ว!** 🎉

