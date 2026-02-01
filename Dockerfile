# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Build arguments for environment variables
ARG VITE_API_URL=https://cucumber-dashboard.win/personal-api
ARG NODE_ENV=production

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV NODE_ENV=$NODE_ENV

# Install deps (pnpm)
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm i --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm run build
  
  
# ---------- Production stage ----------
FROM nginx:alpine

# (Optional) SPA fallback config
# ถ้าคุณมี nginx.conf ของตัวเองอยู่แล้ว ให้ใช้บรรทัด COPY นี้
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ถ้าไม่มี nginx.conf ให้คอมเมนต์บรรทัดด้านบน แล้วใช้ default nginx ก็ได้
# (แต่ SPA refresh อาจ 404 ถ้าไม่ได้ทำ fallback)

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
  