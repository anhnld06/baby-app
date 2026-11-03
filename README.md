# Vani Family — nhật ký mẹ và bé

Ứng dụng riêng cho hai vợ chồng, ưu tiên dùng dễ trên điện thoại: ghi nhanh việc chăm bé, theo dõi sức khỏe của mẹ và xem lại thông tin khi cần. Hai người dùng chung một tài khoản gia đình trên thiết bị riêng; dữ liệu được lưu cùng một nơi.

Đây là công cụ dùng trong gia đình, không hướng tới thương mại. Không cần đăng ký công khai, gói trả phí, mời thành viên hay hệ thống phân quyền nhiều người.

## Cấu trúc sản phẩm

- **Hôm nay:** tổng quan nhanh của gia đình.
- **Của mẹ:** nhật ký hút sữa, chu kỳ kinh, theo dõi khám thai, sổ khám bệnh và bảo hiểm của mẹ.
- **Của bé:** bú/ăn, ngủ, tã, tăng trưởng, tiêm chủng, đơn thuốc, mọc răng, sổ khám và bảo hiểm riêng cho từng bé.
- **Cẩm nang:** thư viện kiến thức theo giai đoạn và truyện đọc cùng bé; không trộn với nhật ký sức khỏe.
- **Hồ sơ:** thông tin định danh của mẹ, từng bé và cài đặt.

Màn hình lớn có thêm mục **Thống kê** ngay dưới Hôm nay trên sidebar. Trang `/statistics` chuyển giữa **Của bé** (bú/ngủ/tã/tăng trưởng, chọn bé) và **Của mẹ** (tổng quan hút sữa, biểu đồ ngày/tháng/năm, xu hướng). Điện thoại giữ thanh điều hướng 5 mục và có lối vào thống kê trên Hôm nay. `/baby/stats` chuyển hướng sang trang mới, giữ bộ lọc ngày/khoảng thời gian.

Giao diện tham khảo cách tổ chức nội dung của [embé](https://embe.icedtealabs.com/vi/): nền trắng/xám sáng, xanh biển–xanh ngọc làm màu chính, màu pastel theo hoạt động và nhật ký gọn. Hôm nay có tóm tắt bằng câu dựa trên bản ghi thật; số ml chỉ tính phần bình đã nhập, không quy đổi bú mẹ. Nhịp 24 giờ giữ riêng trong mục mở rộng. Màn lớn chia nội dung chính và thông tin gia đình thành hai cột; điện thoại xếp dọc, hỗ trợ giao diện tối và giảm chuyển động. Minh họa được tạo từ SVG/icon trong code, không lấy tài sản thương hiệu của trang tham khảo.

## Trải nghiệm hằng ngày

- Lần đầu đăng nhập chọn giai đoạn: mang thai, đã có bé hoặc theo dõi sức khỏe mẹ. Khi đang mang thai và chưa có bé, Hôm nay hiển thị hành trình của mẹ.
- Hôm nay ưu tiên ghi bú/ngủ/tã, hẹn giờ và số liệu trong ngày. Ghi nhanh mở sẵn biểu mẫu; cữ bú gần nhất vẫn hiện khi đã qua nửa đêm.
- Bấm “Kết thúc” ở đồng hồ bú sẽ dừng và lưu thời gian, rồi mở cữ vừa ghi để bổ sung loại sữa, bên bú và lượng bé uống nếu biết. Có thể để trống ml khi bú mẹ trực tiếp; nếu rời biểu mẫu, thời gian đã ghi vẫn được giữ lại.
- Các form tã, bảo hiểm, thai kỳ, khám thai/siêu âm, tăng trưởng và xác nhận giọng nói chỉ hiện trường theo lựa chọn hiện tại. Trường ẩn không gửi khi lưu; đổi lại lựa chọn vẫn giữ bản nháp trước khi lưu. Chi tiết rà soát trong [docs/form-context-review.md](docs/form-context-review.md).
- Biểu mẫu cữ bú hiện trường theo loại đã chọn: bú mẹ trực tiếp ghi bên/thời gian; sữa mẹ bình và sữa công thức ghi lượng uống, không hiện bên trái/phải; cữ kết hợp có cả hai nhóm và ml chỉ tính phần bú bình. Khi sửa đổi loại cữ, các trường không còn liên quan được xóa khi lưu.
- “Nhịp sinh hoạt của bé” trên Hôm nay tóm tắt bú, ngủ và tã theo 24 giờ gần nhất; cân nặng hiển thị ngày đo thật và chênh lệch hai lần cân. Khoảng ngủ tham khảo AASM theo tuổi chỉ để đối chiếu khi đã ghi đủ giấc. Không tự kết luận bú/ngủ đủ hay thiếu từ nhật ký chưa đầy đủ.
- “Bàn giao chăm bé” tạo tóm tắt có thời điểm cập nhật và nút sao chép để người dùng tự chia sẻ.
- Nút Sửa mở đúng bản ghi, tự cuộn đến biểu mẫu và chuyển focus vào vùng chỉnh sửa; đổi bản ghi sẽ nạp lại giá trị. Áp dụng cho các nhật ký, tiêm chủng, kỳ kinh và sơ đồ răng.
- Nút quay lại dùng lịch sử thực tế trong ứng dụng, hỗ trợ Back/Forward. Truy cập trực tiếp có đường về mục cha. Chỉnh sửa, lưu và tải thêm lịch sử dùng replace để tránh vòng lặp.
- Cẩm nang tải 24 bài mỗi trang, không gửi toàn bộ kho bài trên màn chọn giai đoạn. Tìm kiếm tiếng Việt có/không dấu trì hoãn 250 ms lúc đang gõ, hủy request cũ khi đổi bộ lọc. `/api/knowledge` kiểm tra đăng nhập, response `private, no-store`; chỉ danh mục biên tập dùng chung được giữ trong bộ nhớ server tối đa 60 giây mỗi worker, không gồm hồ sơ hay nhật ký sức khỏe. Bộ lọc, từ khóa và trang lưu trên URL; quay lại từ bài viết giữ nguyên lựa chọn. Không tự tải trước toàn bộ bài viết trong danh sách.
- Nút giọng nói nằm cạnh tiêu đề. Chuyển động ngắn, tôn trọng chế độ giảm chuyển động; OCR chỉ tải thư viện nhận diện khi bắt đầu quét.
- Trang dự phòng mất mạng cache các tài nguyên tĩnh bất biến có hash của bản production; không cache trang hoặc API sức khỏe. Service worker v4 tự dọn cache `vani-static-*` cũ và bỏ qua JavaScript/CSS dev không có hash để tránh dùng bundle lỗi thời khi sửa code. Icon/manifest lấy bản mới khi có mạng. Nếu đang giữ tab localhost từ trước thay đổi này, tải lại mạnh bằng Cmd+Shift+R một lần.
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

## Ghi nhanh và hành trình của bé

- **Ghi nhanh** toàn app tách Bú mẹ / Bú bình và mở sẵn loại cữ tương ứng, vẫn có thể đổi. Thức giấc kết thúc giấc ngủ đang chạy hoặc lưu giờ thức riêng khi chưa có giấc đang chạy. Ăn dặm, dấu hiệu/tâm trạng, số đo, tã, hút sữa và kỷ niệm tiếp tục dùng nhật ký riêng.
- **Thống kê chăm bé** (`/baby/stats`) chọn ngày kết thúc và khoảng 7/30 ngày, xem tổng quan ngày đó và chênh lệch số liệu đã ghi so với ngày trước. Có biểu đồ sữa bình, số cữ bú, thời gian ngủ và số lần thay tã; bảng số liệu truy cập được. Chưa có bản ghi là “—”, khác với ghi 0 ml. Cữ kết hợp chỉ tính phần ml bình; không quy đổi phút bú mẹ. Giấc qua nửa đêm chia theo múi giờ tài khoản. Hôm nay chưa kết thúc được ghi rõ. Tăng trưởng ở cùng trang, có tab cân nặng / chiều dài-chiều cao / vòng đầu. Các con số không tự đánh giá đủ/thiếu.
- **Mốc phát triển** (`/baby/milestones`) có bộ sưu tập 47 huy hiệu: 18 cột mốc, 14 khoảnh khắc và 15 thai kỳ. Có lọc nhóm, tiến độ và ngày đã ghi; chào đời/tròn tháng tự tính từ ngày sinh, xử lý cuối tháng. Kỹ năng do gia đình xác nhận và có liên kết tham khảo CDC; chưa ghi không có nghĩa là chưa đạt. Kỷ niệm có ảnh JPG/PNG/WebP tối đa 500 KB, ghi chú, sửa và xóa. Ảnh lưu trong database, chỉ tài khoản gia đình được đọc và không cache.
- **Ăn dặm** (`/baby/meals`) ghi món/nguyên liệu, lượng tùy chọn và quan sát sau bữa. **Dấu hiệu & tâm trạng** (`/baby/wellbeing`) ghi quan sát và tâm trạng; có đường sang trợ lý/cẩm nang hiện có.
- **Nếp ngày EASY** (`/baby/routine`) mặc định chọn mẫu 3 giờ dưới 90 ngày, 3,5 giờ từ 90 đến 149 ngày, 4 giờ từ 150 ngày. Đây là quy tắc sắp xếp của sản phẩm, không phải ngưỡng y khoa hay chỉ định bú/ngủ. Có thể chọn mẫu hoặc tự nhập thời lượng, giờ bắt đầu/kết thúc ngày và bật/tắt điều chỉnh theo nhật ký. Chỉ tạo lịch ban ngày; không suy ra rằng bé không cần ăn ban đêm. Luôn đáp ứng tín hiệu của bé theo [NHS về cho ăn đáp ứng](https://www.nhs.uk/best-start-in-life/baby/feeding-your-baby/bottle-feeding/bottle-feeding-your-baby/feeding-on-demand/).
- EASY hiển thị dự kiến và cữ bú/ngủ/thức thực tế cùng timeline. Ghép bản ghi cùng loại gần mốc trong 90 phút, dùng một bản ghi một lần; bản ghi không khớp vẫn hiện. Khi bật điều chỉnh, giờ kết thúc thực tế làm điểm tính tiếp; giấc đang chạy dùng thời lượng mẫu làm dự kiến, không tự kết thúc giấc. Cập nhật mỗi phút khi đang xem và dừng khi mở cài đặt để bảo vệ bản nháp. Lịch nhập tay vẫn ở phần riêng; đánh dấu hoàn thành không tạo cữ bú/ngủ.
- **Tuần khủng hoảng** (`/baby/development`) có dòng thời gian tuần, chọn tuổi theo ngày sinh hoặc hiệu chỉnh về 40 tuần, các mốc tham khảo từ [tác giả Wonder Weeks](https://thewonderweeks.com/blog/leaps/crankiness-and-crying/) và thông tin về [thay đổi giấc ngủ từ NHS](https://www.nhs.uk/baby/caring-for-a-newborn/helping-your-baby-to-sleep/). Mốc mô hình không được coi là chẩn đoán hoặc dự báo chắc chắn triệu chứng. “Đang theo dõi” chỉ từ đợt gia đình ghi, có ngày bắt đầu, kết thúc thực tế và ngày kết thúc dự kiến tùy chọn của gia đình. Đếm ngược tới mốc mô hình được ghi nhãn riêng với ước tính kết thúc của gia đình.
- **Tháng này có gì** trên Hôm nay hiển thị nội dung theo giai đoạn, tiến độ huy hiệu, đường tới trợ lý và phần cần lưu ý dựa trên đợt thực tế hoặc nội dung tham khảo theo tuổi.
- **Thông báo** (`/notifications`) có chuông và số chưa đọc, lịch tiêm sắp tới hoặc chưa xác nhận trong 30 ngày, thông tin giai đoạn và đợt gia đình đang ghi. Đánh dấu từng mục/tất cả lưu theo tài khoản, đồng bộ khi tải lại trên thiết bị khác. Ngày hẹn đổi tạo khóa thông báo mới. Liên kết lịch hẹn mở đúng hồ sơ bé, kiểm tra quyền ở server. Hộp thông báo độc lập với Web Push đã có.
- Tiêm chủng có hai cách xem **Theo tuổi / Theo vắc-xin**; theo vắc-xin dùng thẻ mũi cuộn ngang và nút tròn. Hai cách xem cùng dùng dữ liệu và thao tác đã có, không nhân bản bản ghi.
- Nhật ký ăn dặm, dấu hiệu, đợt theo dõi, thức giấc và kỷ niệm xuất hiện trong nhật ký chung. CSV gồm cả các mục mới; lịch nhập tay mang loại `ROUTINE`, đợt theo dõi mang `EPISODE` với giờ kết thúc/ước tính riêng. Ảnh không nhúng trong CSV.
- Các nhật ký mới cần mạng khi lưu; offline tiếp tục áp dụng cho bú/ngủ/tã như trước.

Trước khi chạy với database đã có, chạy `npm run db:generate` và `npm run db:deploy`. Migration `20261102130000_baby_care_journal` thêm bảng nhật ký; `20261102150000_complete_baby_journey` thêm cấu hình EASY, khóa huy hiệu, thời điểm đợt theo dõi và trạng thái đọc thông báo. Cả hai giữ nguyên bản ghi cũ. Xem [bảng đối chiếu từng ảnh](docs/reference-feature-coverage.md).

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
`/api/cron/reminders` mỗi 5 phút; endpoint chỉ chấp nhận Bearer token khớp
`CRON_SECRET`. Môi trường triển khai cần hỗ trợ cron 5 phút (hoặc scheduler bên ngoài gọi endpoint cùng Bearer token); cron mỗi ngày không đáp ứng nhắc giờ thuốc. Không tự triển khai hay đổi gói dịch vụ.

Hồ sơ, tổng quan thai kỳ và Thuốc & bổ sung dùng chung subscription của thiết bị. Nhắc tuần thai vào đầu tuần 4–40 theo ngày dự sinh/kỳ kinh cuối; nhắc lịch hẹn trước 7 ngày, 1 ngày và đúng ngày. Thuốc chỉ gửi trong 15 phút sau giờ đã lưu, bỏ qua cữ đã xác nhận và lịch dừng/hết hạn; khóa delivery chống trùng mỗi cữ, TTL 15 phút. Trình duyệt/hệ điều hành có thể trì hoãn hoặc chặn thông báo. Đơn thuốc lưu trữ không tự suy diễn giờ uống: cần tạo lịch dùng cụ thể.

Nội dung notification cố ý không chứa chẩn đoán hoặc tên thuốc.

### WHO Anthro

Local: `npm run who:up`. Ứng dụng dùng `http://localhost:8082` và token local
mặc định khi chạy development. Production cần deploy thư mục
`services/who-anthro` như một container nội bộ và đặt `WHO_ANTHRO_URL`,
`WHO_ANTHRO_TOKEN`. Package `anthro` dùng GPL-3.0; giữ thông tin giấy phép khi
phân phối image/service.


### Nhiệt độ và lịch thuốc

Chạy `npm run db:generate` và `npm run db:deploy` trước khi khởi động phiên bản này. Migration `20261102170000_temperature_medication` thêm các bảng nhiệt độ, lịch thuốc và cữ đã xác nhận; không sửa dữ liệu đơn thuốc cũ.

- `/tracking/temperature`: ghi °C, vị trí đo, thời điểm và ghi chú; sửa/xóa từng lần đo.
- `/tracking/medication`: lịch hằng ngày theo múi giờ tài khoản, nhiều giờ dùng, ngày bắt đầu/kết thúc, tạm dừng lịch và checklist từng cữ. Tích lặp lại không tạo thêm cữ. Có thể tạo lịch từ tên và liều của đơn thuốc đã lưu; người dùng kiểm tra và nhập giờ.
- Nhắc khi đóng app: bật Web Push trong Hồ sơ hoặc Thuốc & bổ sung. Cron mỗi 5 phút kiểm tra giờ dùng đã lưu, bỏ qua cữ đã xác nhận và chống gửi trùng. Trang lịch thuốc không còn phần xuất sang Lịch điện thoại.
- Các lần đo và cữ đã xác nhận xuất hiện trong nhật ký hoạt động và file CSV. Thông báo trong app chỉ nhắc các cữ đã đến giờ trong ngày, chưa xác nhận.
- Lịch tiêm mặc định gom theo vắc-xin và từng mũi/liều, giữ lịch theo tuổi ở tab riêng. Chỉ thay giao diện, không thay mốc tuổi hay tự ghi nhận các lựa chọn phối hợp.

### Hộp thư cho bé

Vào **Của bé → Hộp thư cho bé** để lưu ảnh/video, chọn một trong bốn khung tem và viết thư cho con. Có thể chỉ lưu thư, chụp ảnh bằng camera hoặc quay boomerang (phát xuôi/ngược). Phong bì gom các tem theo tháng tuổi tính từ ngày sinh, dựa trên ngày kỷ niệm trong múi giờ tài khoản; mỗi bé có hộp thư riêng. Mở phong bì để xem hành trình tem và đọc thư. Màn tạo thư cho xem trước khung và lời đề trên tem.

Mỗi thư có thể gắn một tag mốc phát triển (tùy chọn); nhiều thư có thể gắn cùng một mốc. Lọc thư theo mốc trong hộp thư, hoặc mở/tạo thư ngay từ bộ sưu tập mốc phát triển. Với thư cũ, mở **Quản lý kỷ niệm** để đổi/gỡ tag. Tag chỉ liên kết kỷ niệm, không tự ghi nhận bé đã đạt mốc.

Ảnh JPG/PNG/WebP và video MP4/MOV/WebM tối đa 10 MB được lưu trong PostgreSQL, chỉ tài khoản sở hữu hồ sơ được đọc hoặc xóa. Camera cần HTTPS hoặc localhost và trình duyệt hỗ trợ MediaRecorder cho boomerang. Tệp MOV có thể cần trình duyệt hỗ trợ codec tương ứng.

Khi triển khai cập nhật: chạy `npm run db:generate` và `npm run db:deploy`, sau đó build và khởi động lại ứng dụng để áp dụng migration và quyền camera. Sao lưu cơ sở dữ liệu để giữ cả nội dung kỷ niệm và tệp đính kèm.
