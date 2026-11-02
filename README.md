# Vani Family — nhật ký mẹ và bé

Ứng dụng riêng cho hai vợ chồng, ưu tiên dùng dễ trên điện thoại: ghi nhanh việc chăm bé, theo dõi sức khỏe của mẹ và xem lại thông tin khi cần. Hai người dùng chung một tài khoản gia đình trên thiết bị riêng; dữ liệu được lưu cùng một nơi.

Đây là công cụ dùng trong gia đình, không hướng tới thương mại. Không cần đăng ký công khai, gói trả phí, mời thành viên hay hệ thống phân quyền nhiều người.

## Cấu trúc sản phẩm

- **Hôm nay:** tổng quan nhanh của gia đình.
- **Của mẹ:** nhật ký hút sữa, chu kỳ kinh, theo dõi khám thai, sổ khám bệnh và bảo hiểm của mẹ.
- **Của bé:** bú/ăn, ngủ, tã, tăng trưởng, tiêm chủng, đơn thuốc, mọc răng, sổ khám và bảo hiểm riêng cho từng bé.
- **Cẩm nang:** thư viện kiến thức theo giai đoạn và truyện đọc cùng bé; không trộn với nhật ký sức khỏe.
- **Hồ sơ:** thông tin định danh của mẹ, từng bé và cài đặt.

Màn hình lớn dùng sidebar; điện thoại dùng thanh điều hướng 5 mục tương đương.

## Trải nghiệm hằng ngày

- Lần đầu đăng nhập chọn giai đoạn: mang thai, đã có bé hoặc theo dõi sức khỏe mẹ. Khi đang mang thai và chưa có bé, Hôm nay hiển thị hành trình của mẹ.
- Hôm nay ưu tiên ghi bú/ngủ/tã, hẹn giờ và số liệu trong ngày. Ghi nhanh mở sẵn biểu mẫu; cữ bú gần nhất vẫn hiện khi đã qua nửa đêm.
- Bấm “Kết thúc” ở đồng hồ bú sẽ dừng và lưu thời gian, rồi mở cữ vừa ghi để bổ sung loại sữa, bên bú và lượng bé uống nếu biết. Có thể để trống ml khi bú mẹ trực tiếp; nếu rời biểu mẫu, thời gian đã ghi vẫn được giữ lại.
- Các form tã, bảo hiểm, thai kỳ, khám thai/siêu âm, tăng trưởng và xác nhận giọng nói chỉ hiện trường theo lựa chọn hiện tại. Trường ẩn không gửi khi lưu; đổi lại lựa chọn vẫn giữ bản nháp trước khi lưu. Chi tiết rà soát trong [docs/form-context-review.md](docs/form-context-review.md).
- Biểu mẫu cữ bú hiện trường theo loại đã chọn: bú mẹ trực tiếp ghi bên/thời gian; sữa mẹ bình và sữa công thức ghi lượng uống, không hiện bên trái/phải; cữ kết hợp có cả hai nhóm và ml chỉ tính phần bú bình. Khi sửa đổi loại cữ, các trường không còn liên quan được xóa khi lưu.
- “Nhịp sinh hoạt của bé” trên Hôm nay tóm tắt bú, ngủ và tã theo 24 giờ gần nhất; cân nặng hiển thị ngày đo thật và chênh lệch hai lần cân. Khoảng ngủ tham khảo AASM theo tuổi chỉ để đối chiếu khi đã ghi đủ giấc. Không tự kết luận bú/ngủ đủ hay thiếu từ nhật ký chưa đầy đủ.
- “Bàn giao chăm bé” tạo tóm tắt có thời điểm cập nhật và nút sao chép để người dùng tự chia sẻ.
- Nút quay lại dùng lịch sử thực tế trong ứng dụng, hỗ trợ Back/Forward. Truy cập trực tiếp có đường về mục cha. Chỉnh sửa, lưu và tải thêm lịch sử dùng replace để tránh vòng lặp.
- Bộ lọc và tìm kiếm cẩm nang lưu trên URL; quay lại từ bài viết giữ nguyên lựa chọn.
- Nút giọng nói nằm cạnh tiêu đề. Chuyển động ngắn, tôn trọng chế độ giảm chuyển động; OCR chỉ tải thư viện nhận diện khi bắt đầu quét.
- Trang dự phòng mất mạng cache các tài nguyên tĩnh cần để hiển thị; không cache trang hoặc API sức khỏe.
- **Tiêm chủng:** hiện sẵn toàn bộ danh sách mũi theo tuổi, có tóm tắt mốc tiếp theo và tên từng mũi. Tích ngay trên mũi để ghi “Đã tiêm hôm nay”, không cần nhập form; mũi vẫn nằm trong danh sách. Sửa ngày/ghi chú sau nếu cần, có thể bỏ tích. Tự nhận diện lần tiêm cũ; lịch hẹn riêng và lịch sử vẫn ở cùng trang.
- **Nhạc hát ru** trong Của bé: tự gợi ý nhóm 0–6 tháng, 6–12 tháng, 1–3 tuổi hoặc từ 3 tuổi theo hồ sơ đang chọn. Có thể đổi nhóm hoặc xem tất cả bài, kết hợp hát ru tiếng Việt và nhạc nhẹ quốc tế. Nhóm tuổi là cách sắp xếp gợi ý, không phải giới hạn y khoa của bài hát.

**Nhật ký hút sữa:** bấm giờ ngay trên trang **Hôm nay**, cạnh bấm giờ bú/ngủ, hoặc vào **Của mẹ → Nhật ký hút sữa** (`/mother/pumping`) để bấm **Bắt đầu hút → Kết thúc → nhập lượng sữa → Lưu**, tương tự bấm giờ bú. Cữ đang hút được lưu trên máy chủ, vẫn tiếp tục khi rời trang; khi kết thúc, ứng dụng tự điền thời lượng và mở biểu mẫu lượng sữa. Cữ chưa nhập lượng không làm giảm trung bình ml. Vẫn có thể ghi lại cữ cũ bằng biểu mẫu: thời điểm bắt đầu, thời lượng (tùy chọn), lượng sữa bên trái/phải và ghi chú. Nhập ít nhất một bên; có thể ghi 0 ml, để trống bên không hút. Màn hình có sửa/xóa, tải thêm lịch sử, số cữ, tổng ml và trung bình hôm nay theo múi giờ tài khoản. Cữ hút thuộc hồ sơ mẹ, độc lập với cữ bú và lượng bé uống; cần mạng khi lưu.

Biểu đồ **Lượng sữa theo thời gian** có ba chế độ: Ngày (mỗi cữ, tách trái/phải), Tháng (tổng mỗi ngày), Năm (tổng mỗi tháng). Mặc định tháng hiện tại theo múi giờ tài khoản; chọn ngày hoặc chuyển kỳ trước/sau, nhấn cột để xem số cữ, tổng và trung bình/cữ đã nhập lượng. Hiển thị số ngày có ghi lượng, cữ chờ nhập ml, phân biệt chưa có dữ liệu với 0 ml và đánh dấu kỳ hiện tại chưa kết thúc. Chế độ/thời gian lưu trên URL; biểu đồ truy vấn riêng theo kỳ, không bị giới hạn bởi phân trang lịch sử.

Phần **Xu hướng hút sữa** hiển thị 7 ngày trọn vẹn gần nhất (không tính hôm nay), so sánh với 7 ngày trước đó. Phân biệt ngày chưa có dữ liệu, cữ chờ nhập ml và cữ ghi 0 ml; chỉ tính phần trăm khi cả hai giai đoạn có lượng ở mọi ngày, không có cữ thiếu ml và tổng kỳ trước lớn hơn 0. Bảng đối chiếu chỉ lấy “Sữa mẹ bình” của bé đang chọn, không dùng chênh lệch làm kết luận đủ/thiếu hay tồn kho. Có liên kết nhật ký tã và tăng trưởng. Giới hạn diễn giải tham khảo [HSE về nguồn sữa](https://www2.hse.ie/babies-children/breastfeeding/common-challenges/breast-milk-supply/).

Thiết kế trường nhật ký tham khảo [mẫu ghi cữ hút của Intermountain Health](https://intermountainhealthcare.org/ckr-ext/Dcmnt?ncid=520944174) (thời điểm, lượng từng bên, tổng ngày) và [hướng dẫn hút sữa của CDC](https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/pumping-breast-milk.html). Ứng dụng không đặt mục tiêu sản lượng hay tự đánh giá nguồn sữa.

Trước khi chạy phiên bản có nhật ký hút sữa, chạy `npm run db:generate` và `npm run db:deploy` để áp dụng các migration `20261102100000_add_pumping_entries` và `20261102110000_add_pumping_timer` (thêm bảng và trạng thái bấm giờ, giữ nguyên dữ liệu cũ).

Các tình huống sử dụng và lưu ý vận hành trong gia đình được ghi trong [docs/product-readiness.md](docs/product-readiness.md).

Nhạc hát ru phát trực tiếp bằng file MP3 trong `public/audio/lullabies/`, chia thư mục `0-6-thang`, `6-12-thang`, `1-3-tuoi`, `3-tuoi-tro-len`. Có nghe lặp, dừng, hẹn dừng 10/20/30 phút và tải MP3 về máy để nghe ngoại tuyến bằng trình nghe nhạc của thiết bị. Không mở YouTube khi nghe. Trình phát trong ứng dụng cần mạng để tải file; không tự lưu toàn bộ thư viện vào điện thoại. Khi khóa màn hình, phát nhạc và hẹn dừng phụ thuộc trình duyệt. Nguồn, ghi công, giấy phép và mã kiểm tra từng file được lưu ở [thư viện nhạc](public/audio/lullabies/README.md) và `sources.json`. Các bản ru Nam Bộ có giấy phép CC BY-NC tại nguồn, dành cho việc sử dụng phi thương mại của gia đình.

### Cập nhật luồng tiêm chủng

Khi cập nhật bản đã có dữ liệu, chạy `npm run db:generate` và `npm run db:deploy` trước khi khởi động app mới. Migration `20261102070000_unify_vaccination_appointments` giữ các lần tiêm cũ và chuyển ngày hẹn tiếp theo đã lưu thành lịch hẹn riêng. Migration `20261102090000_vaccination_checklist_keys` thêm mã mũi tham khảo và ràng buộc duy nhất theo mẹ/bé, không thay đổi dữ liệu cũ. Khi cả hai vợ chồng cùng tích một mũi, chỉ tạo một bản ghi.

Danh sách theo tuổi tự tính các mốc tháng từ ngày sinh (có xử lý cuối tháng), hiển thị cả mũi đã tiêm và các mũi sau. Mốc TCMR được đối chiếu với [Viện Vệ sinh dịch tễ Trung ương](https://nihe.org.vn/chuyen-mon/tiem-chung-vac-xin/cac-vac-xin-trong-tiem-chung-mo-rong/) ngày 02/11/2026; lịch thực tế theo cơ sở tiêm. Danh mục dịch vụ là tham khảo, tùy loại vắc-xin và tiền sử. Lịch nhắc trên trang chủ, Web Push và file lịch vẫn lấy từ ngày hẹn gia đình nhập; danh sách theo tuổi không tự tạo thông báo. Đánh dấu đã tiêm không thay đổi ngày hẹn ban đầu; hai ngày được lưu riêng. Khi thêm hẹn tiếp theo, số mũi để trống để gia đình tự nhập nếu cần.

File `.ics` tải xuống là bản chụp tại thời điểm xuất. Nếu đã nhập vào lịch điện thoại, thay đổi trong app không tự sửa hoặc xóa sự kiện đã nhập ở đó.

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
- Cột embedding dùng pgvector 1536 chiều để sẵn sàng cho semantic retrieval. MVP retrieval hiện chuẩn hóa tiếng Việt có/không dấu, bỏ từ chung, chấm độ liên quan và dùng giai đoạn để xếp hạng; chưa có pipeline ingest/embed. Đây vẫn là tìm kiếm từ khóa, không phải kiểm chứng y khoa tự động.

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

Prisma migration dùng `DATABASE_URL_UNPOOLED` (kết nối trực tiếp, hostname Neon không có `-pooler`); ứng dụng dùng `DATABASE_URL` (có thể dùng pooler). Cấu hình cả hai trong môi trường deploy để tránh lỗi advisory lock khi migration qua pooler. Local không có biến riêng sẽ dùng cùng `DATABASE_URL`.

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
