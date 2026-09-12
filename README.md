# Vani Family — nhật ký mẹ và bé

Ứng dụng mobile-first để quản lý hành trình làm mẹ và chăm sóc bé trong hai không gian dữ liệu tách biệt, kèm cẩm nang có nguồn và trợ lý AI có lớp an toàn.

## Cấu trúc sản phẩm

- **Hôm nay:** tổng quan nhanh của gia đình.
- **Của mẹ:** chu kỳ kinh, theo dõi khám thai, sổ khám bệnh và bảo hiểm của mẹ.
- **Của bé:** bú/ăn, ngủ, tã, tăng trưởng, tiêm chủng, đơn thuốc, mọc răng, sổ khám và bảo hiểm riêng cho từng bé.
- **Cẩm nang:** thư viện kiến thức theo giai đoạn và truyện đọc cùng bé; không trộn với nhật ký sức khỏe.
- **Hồ sơ:** thông tin định danh của mẹ, từng bé và cài đặt.

Màn hình lớn dùng sidebar; điện thoại dùng thanh điều hướng 5 mục tương đương.

## Chạy local

Yêu cầu: Node.js 22+, npm và Docker.

```bash
cp .env.example .env
docker compose up -d --build
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Trên PowerShell dùng `Copy-Item .env.example .env`, đặt `APP_USERNAME` và `APP_PASSWORD`, sau đó mở http://localhost:3000. App không có đăng ký công khai; tài khoản gia đình được cấu hình hoàn toàn bằng biến môi trường.

Kiểm tra chất lượng:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

## AI và cẩm nang

- Seed nạp kho bài tiếng Việt có phân loại bằng chứng và liên kết tới WHO, CDC, ACOG, NHS và UNICEF Việt Nam.
- Mẹo dân gian được gắn nhãn riêng; nội dung có thể gây hại được cảnh báo rõ, không trình bày như chỉ định điều trị.
- Khi chưa có bài phù hợp kèm nguồn, assistant trả về “không đủ dữ liệu” và không gọi model để suy đoán.
- Có thể cấu hình provider OpenAI-compatible qua `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`. Provider nằm sau interface để thay thế dễ dàng.
- `RuleEngine` xử lý các red flag khẩn cấp trước khi gọi model; chỉ mở rộng rule khi có nguồn đáng tin cậy, phiên bản, người duyệt và test.
- Cột embedding dùng pgvector 1536 chiều để sẵn sàng cho semantic retrieval. MVP retrieval hiện dùng stage + full-text đơn giản; chưa có pipeline ingest/embed.

## Giả định MVP

- App chỉ có một tài khoản gia đình lấy từ `APP_USERNAME` và `APP_PASSWORD`; không có đăng ký công khai và không cần email. Mật khẩu chỉ tồn tại trong biến môi trường. Session lưu token ngẫu nhiên trong cookie HttpOnly và chỉ lưu hash token trong PostgreSQL. Dữ liệu mẹ/bé được giới hạn theo user ID lấy từ session phía server.
- Đổi `APP_PASSWORD` sẽ tự làm mọi session cũ mất hiệu lực; người dùng cần đăng nhập lại.
- App không thu email nên chưa có luồng “quên mật khẩu”. Nếu mất mật khẩu, quản trị viên phải đặt lại credential trực tiếp hoặc bổ sung cơ chế khôi phục sau này.
- Các màn hình của bé dùng hồ sơ đang chọn và hỗ trợ chuyển giữa nhiều bé.
- Mốc “hôm nay” và dữ liệu `datetime-local` được quy đổi theo IANA timezone của tài khoản.
- Biểu đồ tăng trưởng luôn hoạt động độc lập. Z-score WHO được tính qua service riêng dùng package `anthro`; kết quả chỉ mang tính tham khảo và có cờ chất lượng số đo.
- PWA có manifest, service worker và chế độ offline opt-in cho bản ghi bú/ngủ/tã. Response API và HTML chứa dữ liệu sức khỏe không được cache.
- Docker map PostgreSQL ra cổng `5433` mặc định để tránh xung đột PostgreSQL local; đổi bằng `POSTGRES_PORT` nếu cần.

## Deploy

Deploy Next.js lên Vercel, trỏ `DATABASE_URL` tới PostgreSQL có pgvector (Supabase/Neon), đặt `APP_USERNAME`, `APP_PASSWORD`, `APP_DISPLAY_NAME` và các biến cần thiết trong project settings, rồi chạy `npx prisma migrate deploy`. Chỉ chạy `npm run db:seed` nếu thực sự cần dữ liệu mẫu. Không commit `.env` hoặc credentials.

### Web Push

Chạy `npm run push:keys` một lần rồi lưu public/private key vào
`NEXT_PUBLIC_VAPID_PUBLIC_KEY` và `VAPID_PRIVATE_KEY`. Đặt thêm
`VAPID_SUBJECT` và `CRON_SECRET`. Vercel Cron gọi
`/api/cron/reminders` mỗi ngày; endpoint chỉ chấp nhận Bearer token khớp
`CRON_SECRET`. Nội dung notification cố ý không chứa chẩn đoán hoặc tên thuốc.

### WHO Anthro

Local: `npm run who:up`. Ứng dụng dùng `http://localhost:8082` và token local
mặc định khi chạy development. Production cần deploy thư mục
`services/who-anthro` như một container nội bộ và đặt `WHO_ANTHRO_URL`,
`WHO_ANTHRO_TOKEN`. Package `anthro` dùng GPL-3.0; giữ thông tin giấy phép khi
phân phối image/service.
