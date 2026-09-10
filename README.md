# Mầm — nhật ký mẹ và bé

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
docker compose up -d
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
```

## AI và cẩm nang

- Seed nạp kho bài tiếng Việt có phân loại bằng chứng và liên kết tới WHO, CDC, ACOG, NHS và UNICEF Việt Nam.
- Mẹo dân gian được gắn nhãn riêng; nội dung có thể gây hại được cảnh báo rõ, không trình bày như chỉ định điều trị.
- Khi chưa có bài phù hợp kèm nguồn, assistant trả về “không đủ dữ liệu” và không gọi model để suy đoán.
- Có thể cấu hình provider OpenAI-compatible qua `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`. Provider nằm sau interface để thay thế dễ dàng.
- `RuleEngine` cố ý chưa có red flag. Chỉ thêm rule khi có nguồn đáng tin cậy, phiên bản, người duyệt và test.
- Cột embedding dùng pgvector 1536 chiều để sẵn sàng cho semantic retrieval. MVP retrieval hiện dùng stage + full-text đơn giản; chưa có pipeline ingest/embed.

## Giả định MVP

- App chỉ có một tài khoản gia đình lấy từ `APP_USERNAME` và `APP_PASSWORD`; không có đăng ký công khai và không cần email. Mật khẩu chỉ tồn tại trong biến môi trường. Session lưu token ngẫu nhiên trong cookie HttpOnly và chỉ lưu hash token trong PostgreSQL. Dữ liệu mẹ/bé được giới hạn theo user ID lấy từ session phía server.
- Đổi `APP_PASSWORD` sẽ tự làm mọi session cũ mất hiệu lực; người dùng cần đăng nhập lại.
- App không thu email nên chưa có luồng “quên mật khẩu”. Nếu mất mật khẩu, quản trị viên phải đặt lại credential trực tiếp hoặc bổ sung cơ chế khôi phục sau này.
- Các màn hình của bé dùng hồ sơ đang chọn và hỗ trợ chuyển giữa nhiều bé.
- Mốc “hôm nay” dùng timezone của runtime khi query. Trường timezone đã có trong user; chuẩn hóa query theo IANA timezone là bước tiếp theo trước khi dùng đa múi giờ.
- Không tính percentile và không đưa khuyến nghị sức khỏe khi chưa có bộ dữ liệu/nguồn chuẩn đã kiểm duyệt.
- PWA có manifest, icon, standalone mode và metadata iOS. MVP không triển khai offline sync.
- Docker map PostgreSQL ra cổng `5433` mặc định để tránh xung đột PostgreSQL local; đổi bằng `POSTGRES_PORT` nếu cần.

## Deploy

Deploy Next.js lên Vercel, trỏ `DATABASE_URL` tới PostgreSQL có pgvector (Supabase/Neon), đặt `APP_USERNAME`, `APP_PASSWORD`, `APP_DISPLAY_NAME` và các biến cần thiết trong project settings, rồi chạy `npx prisma migrate deploy`. Chỉ chạy `npm run db:seed` nếu thực sự cần dữ liệu mẫu. Không commit `.env` hoặc credentials.
