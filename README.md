# Khang Thịnh Investment — Website

Website giới thiệu Công ty TNHH Khang Thịnh Investment (MST 1102 107 064) — cung ứng cát/đá/san lấp, xây dựng dân dụng, vận chuyển đường thủy. Site là static export (Next.js 15 App Router), deploy lên Vercel.

## Tech Stack

| Layer       | Tech                                        |
|-------------|---------------------------------------------|
| Framework   | Next.js 15 (App Router, `output: 'export'`) |
| UI          | React 19                                    |
| Styling     | Tailwind CSS 4 (`@theme` directive)         |
| Language    | TypeScript 5.9 (strict)                     |
| Font        | Be Vietnam Pro (subsets: vietnamese, latin) |
| Icons       | lucide-react                                |
| Analytics   | @vercel/analytics                           |
| Hosting     | Vercel (Hobby tier)                         |

## Dev

```bash
npm install
npm run dev
# http://localhost:3000
```

## Build

```bash
npm run build
# Output: out/  (static HTML — / + /du-an + 404)
```

## Local prod-mode smoke test

```bash
npm run build && npx serve out/ -l 3003
# http://localhost:3003
```

Mở DevTools → Console: 0 errors. Network: không có asset 404. Test trang 404 bằng URL bất kỳ không tồn tại (vd `/khong-ton-tai`).

## Deploy → Vercel

1. Truy cập <https://vercel.com/new>
2. Import GitHub repo `phanchicong01/khangthinhdemo`
3. Project name: tùy chọn (vd `khang-thinh-website`)
4. Framework Preset: **Next.js** (Vercel tự nhận diện)
5. Build Command: mặc định (`next build`) — không sửa
6. Output Directory: mặc định — Vercel tự nhận `out/` từ config `output: 'export'`
7. Environment Variables → Add:
   - Name: `NEXT_PUBLIC_SITE_URL`
   - Value: URL Vercel sẽ gán (vd `https://khang-thinh-website.vercel.app`) — đặt sau lần deploy đầu nếu chưa biết
   - Environment: **Production**
8. Click **Deploy**
9. Chờ build (~30–60s) → ghi nhận URL được gán

**Quan trọng:** `NEXT_PUBLIC_SITE_URL` phải được set TRƯỚC khi build chạy. Nếu set sau, sitemap.xml / JSON-LD / OG metadata sẽ dùng giá trị fallback `https://khangthinhinv.vn` (placeholder) — phải redeploy để cập nhật.

## Custom domain (post-launch)

Khi đã có domain thật (vd `khangthinhinv.vn`):

1. Vercel project → Settings → Domains → Add domain → nhập domain
2. Cập nhật DNS record (Vercel hiển thị A/CNAME cần thêm) — chờ propagate
3. Project → Settings → Environment Variables → cập nhật `NEXT_PUBLIC_SITE_URL` = `https://khangthinhinv.vn`
4. Redeploy (Deployments → ... → Redeploy)
5. SSL tự cấp qua Let's Encrypt (~1–2 phút sau khi DNS active)

## Analytics

Vercel Analytics đã wired sẵn qua component `<Analytics />` trong `src/app/layout.tsx`. Chỉ fire trên production (Vercel-injected `VERCEL_ENV`). Xem dashboard:

```
https://vercel.com/<project>/analytics
```

Pageviews sẽ xuất hiện trong ~5 phút sau khi có truy cập production thực tế.

## Repository

<https://github.com/phanchicong01/khangthinhdemo>
