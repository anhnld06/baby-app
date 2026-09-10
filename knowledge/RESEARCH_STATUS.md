# Research Status — Cẩm nang Mẹ & Bé Knowledge Base

Trạng thái: `DONE` | `PARTIAL` | `IN_PROGRESS` | `NOT_RESEARCHED` | `NEEDS_UPDATE` | `CONFLICTING`

Ghi chú kiến trúc: ứng dụng lưu knowledge trực tiếp trong
`src/features/knowledge/articles.ts` (mảng `curatedArticles`, khớp với model Prisma
`KnowledgeArticle` + `KnowledgeSource` + `KnowledgeChunk`). Không có schema
`whatParentsMayNotice` / `whenToContactDoctor` / `emergencySigns` dạng field riêng — các
mục này được viết dưới dạng heading markdown (`## Cần khám ngay`, `## Đi khám nếu`, ...)
bên trong field `content`, theo đúng convention đã có sẵn trong file.

---

## BATCH 1 — NEWBORN 0–28 NGÀY (hoàn tất giai đoạn 1, chờ review)

### Đã có sẵn trong app trước batch này
| Topic | Slug | Status |
|---|---|---|
| Chăm sóc sơ sinh hằng ngày (tổng quan) | cham-soc-be-so-sinh-hang-ngay | DONE |
| Bú mẹ & dấu hiệu bú đủ | bu-me-va-dau-hieu-be-bu-du | DONE |
| Ngủ an toàn | ngu-an-toan-cho-be | DONE |
| Quấy khóc / colic | be-quay-khoc-va-colic | DONE |
| Vặn mình, rặn đỏ mặt, ngủ không yên | van-minh-ran-do-va-ngu-khong-yen | DONE |
| Chăm rốn & tắm bé | cham-soc-ron-va-tam-be | DONE — bệnh lý rốn (u hạt/nhiễm trùng/chảy máu) nay có bài riêng, xem u-hat-ron-va-dau-hieu-nhiem-trung-ron |
| Mẹo dân gian cần tránh | meo-dan-gian-can-tranh-cho-tre-so-sinh | DONE |
| Dấu hiệu nguy hiểm ở trẻ sơ sinh | dau-hieu-nguy-hiem-o-tre-so-sinh | DONE |
| Vàng da | vang-da-o-tre-so-sinh | DONE |
| Phát ban da (milia, mụn sữa, rôm sảy) | phat-ban-da-thuong-gap-o-tre-so-sinh | DONE |
| Hăm tã | hom-ta-o-tre | DONE |
| Trớ sữa & nôn (kể cả hẹp môn vị) | tro-sua-va-non-o-tre | DONE |
| Nấc cụt & nhịp thở bình thường | nac-cut-va-nhip-tho-binh-thuong | DONE |
| Phân & táo bón | phan-va-tao-bon-o-tre-so-sinh | DONE |
| Sốt — ngưỡng khám theo tuổi | sot-o-tre-nho-khi-nao-can-kham | DONE |
| Ho, nghẹt mũi, cảm lạnh | ho-nghet-mui-cam-lanh-o-tre-duoi-1-tuoi | DONE |

### Đã bổ sung trong Batch 1 (5 nhánh nghiên cứu song song, đã đưa vào articles.ts)
| Topic cluster | Slug bài mới | Status |
|---|---|---|
| Giấc ngủ sinh lý: tổng thời gian ngủ, active/quiet sleep, day/night confusion, tiếng động khi ngủ | giac-ngu-sinh-ly-va-tieng-dong-binh-thuong-khi-ngu | DONE |
| Quấn, núm ti giả, nhiệt độ phòng/quạt/điều hòa/máy tạo ẩm, phòng chung-giường riêng (chi tiết hơn) | quan-be-num-ti-gia-va-nhiet-do-phong-ngu | DONE |
| Bú cụm, comfort nursing, tần suất bú/ngày | bu-cum-va-so-cu-bu-moi-ngay | DONE |
| Đánh thức bú, chỉ định y khoa để bổ sung sữa công thức | danh-thuc-be-bu-va-bo-sung-sua-cong-thuc-khi-nao-can | DONE |
| Pha sữa công thức, bảo quản, paced bottle feeding | pha-sua-cong-thuc-va-bu-binh-dung-cach | DONE |
| Dấu hiệu nhiều sữa/ít sữa (mẹ & bé) | it-sua-hay-nhieu-sua-dau-hieu-tu-me-va-be | DONE |
| Số tã ướt theo ngày tuổi, màu nước tiểu, urate crystal, mất nước | so-ta-uot-va-nuoc-tieu-cua-tre-so-sinh | DONE (1 điểm CONFLICTING_EVIDENCE đã ghi rõ) |
| Phản xạ Moro/rooting/sucking/grasp/stepping | phan-xa-nguyen-thuy-o-tre-so-sinh | DONE |
| Cơ chế điều nhiệt, hạ thân nhiệt, đo nhiệt độ, ngưỡng sốt (nhắc lại + bổ sung góc nhìn WHO) | than-nhiet-va-do-nhiet-do-dung-cach-cho-tre-so-sinh | DONE |
| Sàng lọc sơ sinh (gót chân/tim/thính lực), lịch khám WHO/AAP, tình trạng VN | sang-loc-so-sinh-va-lich-kham-thang-dau | DONE (phần Việt Nam ghi rõ NOT_FOUND cho mốc 0-28 ngày) |
| Rốn: u hạt, chảy máu, nhiễm trùng (omphalitis), chlorhexidine vs dry cord care | u-hat-ron-va-dau-hieu-nhiem-trung-ron | DONE |
| Thị giác (khoảng cách nhìn, lác thoáng qua, xuất huyết kết mạc, tắc tuyến lệ, dấu hiệu đỏ đồng tử) + thính giác sớm | thi-giac-va-thinh-giac-cua-tre-so-sinh | DONE |

Tổng cộng: **12 bài viết mới**, nâng tổng số bài cho stage `NEWBORN_0_28_DAYS` (hoặc phủ một phần
giai đoạn này) lên 28 bài. Toàn bộ đã pass `npm test` (9/9, bao gồm test slug-trùng-lặp và
test yêu cầu mỗi bài có ít nhất 1 nguồn) và `npm run typecheck`.

### Chưa nghiên cứu trong Batch 1 (ghi nhận để cân nhắc mở rộng)
- Circumcision care — ít liên quan bối cảnh Việt Nam, NOT_RESEARCHED (có thể bỏ qua vĩnh viễn trừ khi có yêu cầu).
- GBS (Group B Strep) — thuộc về giai đoạn mang thai/chuyển dạ nhiều hơn newborn, để dành cho Batch pregnancy/labor.
- Trẻ sinh non (premature-specific newborn care) — NOT_RESEARCHED, cần batch riêng vì khác biệt lớn so với đủ tháng.
- Sàng lọc tim bẩm sinh chi tiết, sàng lọc gót chân chi tiết theo từng bệnh — sẽ tùy thuộc kết quả nhánh "Thân nhiệt & khám sàng lọc".

### Known schema gap
- Prisma enum `EvidenceLevel` hiện KHÔNG có giá trị `CONFLICTING_EVIDENCE` (chỉ có STRONG /
  MODERATE / LIMITED / TRADITIONAL / NO_EVIDENCE / POTENTIALLY_HARMFUL). Theo nguyên tắc
  "không sửa application logic nếu không cần thiết", batch này sẽ diễn đạt xung đột giữa
  các guideline bằng văn xuôi trong `content` (ví dụ: "WHO khuyến nghị X, trong khi AAP
  khuyến nghị Y vì...") thay vì thêm enum mới. Nếu số lượng xung đột lớn ở các batch sau,
  nên cân nhắc thêm enum value — nhưng đó là quyết định của người phát triển ứng dụng,
  không tự ý thực hiện ở đây.

---

## BATCH 2 — BREASTFEEDING CHUYÊN SÂU (hoàn tất giai đoạn 1, chờ review)

5 nhánh nghiên cứu song song, 12 bài viết mới, tất cả gán `stage: "POSTPARTUM"` (không đặt
`minimumAgeDays`/`maximumAgeDays` vì đây là kiến thức cho mẹ/quy trình cho bú, không gắn với
tuổi bé — theo đúng convention đã có sẵn ở các bài POSTPARTUM khác trong file).

| Topic cluster | Slug bài mới | Status |
|---|---|---|
| Sữa non/chuyển tiếp/trưởng thành, cơ chế cung-cầu, relactation | sua-non-sua-chuyen-tiep-va-co-che-cung-cau-sua | DONE |
| Sữa đầu/sữa cuối — myth-bust "sữa loãng không có chất" | sua-dau-sua-cuoi-su-that-ve-sua-loang | DONE |
| Tư thế bú & dấu hiệu khớp ngậm tốt/chưa tốt | tu-the-bu-va-dau-hieu-khop-ngam-tot | DONE |
| Đau/nứt đầu ti, vai trò nấm miệng vs cơ học | dau-va-nut-dau-ti-khi-cho-con-bu | DONE (CONFLICTING_EVIDENCE về vai trò thrush đã ghi rõ) |
| Đình công bú & nhầm lẫn núm vú | be-tu-choi-bu-va-nham-lan-num-vu | DONE (bằng chứng nipple confusion ghi rõ là yếu/mâu thuẫn) |
| Hút sữa: loại máy, tần suất, vệ sinh dụng cụ | hut-sua-chon-may-tan-suat-va-ve-sinh | DONE |
| Bảo quản/rã đông/hâm sữa mẹ | bao-quan-ra-dong-va-ham-sua-me-dung-cach | DONE (CONFLICTING_EVIDENCE CDC 4 ngày vs NHS 8 ngày đã ghi rõ) |
| Kết hợp bú mẹ và sữa công thức | ket-hop-bu-me-va-sua-cong-thuc | DONE |
| Thuốc, tránh thai và bú mẹ (nguyên tắc chung) | thuoc-tranh-thai-va-bu-me-nguyen-tac-chung | DONE (khuyến nghị tra LactMed + hỏi bác sĩ, không tự liệt kê thuốc "an toàn") |
| Rượu, caffeine, ngủ gật khi cho bú | ruou-caffeine-va-ngu-gat-khi-cho-con-bu | DONE (myth "vắt bỏ sữa sau rượu" đã bị bác bỏ rõ ràng) |
| Thời gian bú mẹ khuyến nghị & cách cai sữa | bu-me-nen-keo-dai-bao-lau-va-cach-cai-sua | DONE |
| Khi nào bú mẹ cần thận trọng đặc biệt/chống chỉ định | khi-nao-bu-me-can-than-trong-dac-biet | DONE (chủ đề nhạy cảm — mọi trường hợp đều dẫn về "hỏi bác sĩ", không tự kết luận) |

Tổng cộng: **12 bài viết mới**. `npm test` 9/9 pass, `npm run typecheck` sạch.

### Chưa nghiên cứu trong Batch 2 (ghi nhận để cân nhắc mở rộng)
- Chi tiết hóa trị/xạ trị và bú mẹ — KHÔNG xác minh được qua nguồn Tier A trực tiếp trong batch
  này; bài "khi-nao-bu-me-can-than-trong-dac-biet" chủ động không đưa ra khẳng định cụ thể và
  hướng người dùng hỏi bác sĩ điều trị.
- Danh sách thuốc "an toàn" đầy đủ theo LactMed — không liệt kê chi tiết trong app (NCBI chặn
  fetch trực tiếp), chỉ hướng dẫn nguyên tắc chung + tra cứu LactMed cùng bác sĩ/dược sĩ.
- Vắt sữa khi mang thai/nuôi song song hai bé (tandem nursing) — bằng chứng còn rất mỏng (một
  nghiên cứu quan sát, loại trừ thai kỳ nguy cơ cao), đã ghi rõ trong bài cai sữa.

### Known verification gap — vài URL suy luận theo mẫu
Xem ghi chú ⚠️ trong SOURCES.md cho `weaningNHS`, `weaningAAP`, `weaningLLLI`, và
`contraindicationsCDC` — các URL này được suy luận từ cấu trúc đường dẫn nhất quán của các
trang cùng nhóm đã được agent xác nhận fetch trực tiếp, nhưng bản thân URL cụ thể chưa được
agent dán lại nguyên văn. Nên xác minh lại trước khi hiển thị link cho người dùng cuối
(nội dung/claim vẫn đáng tin vì agent đã đọc trực tiếp trang, chỉ là đường dẫn cụ thể cần
double-check).

---

## BATCH 3 — MANG THAI (hoàn tất giai đoạn 1)

12 bài mới, `stage: "PREGNANCY"`. `npm test` 9/9 pass, `npm run typecheck` sạch.

| Slug | Status |
|---|---|
| tam-ca-nguyet-1-thay-doi-va-phat-trien-thai | DONE |
| tam-ca-nguyet-2-thay-doi-va-phat-trien-thai | DONE |
| tam-ca-nguyet-3-thay-doi-va-lich-kham-tang-dan | DONE |
| lich-kham-thai-who-va-cac-nuoc-khac-nhau-the-nao | DONE |
| nghen-va-non-nghen-nang-hyperemesis-gravidarum | DONE |
| dau-lung-va-phu-chan-khi-mang-thai | DONE |
| tang-huyet-ap-thai-ky-va-tien-san-giat | DONE (an toàn cao — nội dung nhạy cảm, không tự đoán ngưỡng HELLP) |
| tieu-duong-thai-ky-sang-loc-va-quan-ly | DONE (CONFLICTING_EVIDENCE 1 bước vs 2 bước đã ghi rõ) |
| ra-mau-va-bien-chung-nhau-thai-khi-mang-thai | DONE |
| thieu-mau-khi-mang-thai-sang-loc-va-bo-sung-sat | DONE (nguồn mạnh nhất batch — đọc toàn văn ACOG PB233 + CDC MMWR) |
| dau-hieu-chuyen-da-sinh-non-va-vo-oi-truoc-37-tuan | DONE |
| thai-may-giam-khi-nao-can-di-kham-ngay | DONE (cập nhật quan trọng: đếm cử động cố định không còn được xem là biện pháp có bằng chứng) |

Chưa nghiên cứu trong Batch 3: HELLP (tiêu chuẩn chẩn đoán xét nghiệm cụ thể — không tìm thấy
nguồn Tier A/B nêu rõ, không đưa số liệu cụ thể vào app); thai kỳ đa thai (song/đa thai) — để
dành batch riêng nếu cần; sảy thai/thai lưu (xử trí, hỗ trợ tâm lý) — chưa nghiên cứu.

---

## BATCH 4 — CHUYỂN DẠ & SINH (hoàn tất giai đoạn 1)

10 bài mới. `npm test` 9/9 pass, `npm run typecheck` sạch.

| Slug | Status |
|---|---|
| cac-giai-doan-chuyen-da-va-thoi-gian-tham-khao | DONE (mốc 4cm vs 6cm ACOG/NICE ghi rõ) |
| theo-doi-tim-thai-trong-chuyen-da-lien-tuc-hay-ngat-quang | DONE |
| khoi-phat-chuyen-da-khi-nao-va-phuong-phap-nao | DONE (ARRIVE trial + khác biệt ACOG/NICE ghi rõ) |
| gay-te-ngoai-mang-cung-va-thuoc-giam-dau-trong-chuyen-da | DONE |
| phuong-phap-giam-dau-khong-dung-thuoc-khi-chuyen-da | DONE (Cochrane vs ACOG về sinh dưới nước ghi rõ) |
| rach-tang-sinh-mon-khi-sinh-phan-loai-va-phong-ngua | DONE |
| sinh-thuong-sau-mo-lay-thai-vbac | DONE (bằng chứng RCT mỏng đã ghi rõ) |
| kep-ron-muon-va-da-ke-da-ngay-sau-sinh | DONE |
| xu-tri-tich-cuc-giai-doan-3-va-du-phong-bang-huyet-sau-sinh | DONE (băng huyết nặng "chưa chắc chắn" đã ghi rõ) |
| chi-so-apgar-y-nghia-va-hieu-lam-thuong-gap | DONE |

Chưa nghiên cứu: mổ lấy thai chi tiết (chỉ định, kỹ thuật) — đã có bài tổng quan trước đó,
chưa đào sâu thêm trong batch này; sinh đôi/đa thai — chưa nghiên cứu; doula/kế hoạch sinh chi
tiết — đã đề cập gián tiếp qua bài hỗ trợ liên tục.

---

## BATCH 5 — HẬU SẢN SÂU HƠN (hoàn tất giai đoạn 1)

10 bài mới. `npm test` 9/9 pass, `npm run typecheck` sạch.

| Slug | Status |
|---|---|
| tu-cung-co-hoi-va-dau-bung-sau-sinh | DONE |
| tao-bon-va-tri-sau-sinh-cach-xu-tri-an-toan | DONE (Cochrane: không có RCT đủ điều kiện cho táo bón sau sinh, đã ghi rõ) |
| ve-sinh-tam-va-van-dong-sau-sinh | DONE |
| quan-he-tinh-duc-sau-sinh-khi-nao-va-nhung-dieu-can-biet | DONE |
| tranh-thai-sau-sinh-va-phuong-phap-vo-kinh-cho-con-bu-lam | DONE (CONFLICTING_EVIDENCE hiệu quả LAM đã ghi rõ) |
| kinh-nguyet-tro-lai-va-khoang-cach-giua-cac-lan-sinh | DONE (WHO 24 tháng vs ACOG linh hoạt hơn đã ghi rõ) |
| phan-biet-baby-blues-tram-cam-va-lo-au-sau-sinh | DONE (đọc toàn văn ACOG CPG 4&5) |
| sang-loc-tram-cam-sau-sinh-epds-va-khi-nao-thuc-hien | DONE |
| loan-than-sau-sinh-dau-hieu-cap-cuu-tam-than | DONE |
| huyet-khoi-tinh-mach-va-nhiem-trung-hau-san-dau-hieu-cap-cuu | DONE (20-25% sepsis sau sinh không sốt — điểm an toàn quan trọng) |

Chưa nghiên cứu: bệnh tuyến giáp sau sinh (postpartum thyroiditis) — chưa nghiên cứu; rụng tóc
sau sinh — chưa nghiên cứu; phục hồi sau sinh đôi/đa thai — chưa nghiên cứu.

---

## BATCH 6 — TRẺ 1–6 THÁNG (hoàn tất giai đoạn 1)

9 bài mới. `npm test` 9/9 pass, `npm run typecheck` sạch. **Phát hiện lớn nhất: bảng mốc phát
triển CDC 2021-2022 dời nhiều mốc quen thuộc sang 9 tháng** (ngồi vững, chuyển đồ vật qua tay,
phản ứng gọi tên, bập bẹ "ba-ba") — xem chi tiết trong SOURCES.md.

| Slug | Status |
|---|---|
| giac-ngu-tre-1-6-thang-va-su-that-ve-sleep-regression | DONE |
| thi-giac-cua-tre-1-6-thang-mau-sac-phoi-hop-mat-tay | DONE |
| moc-phat-trien-cdc-2-4-6-thang-day-du | DONE (mốc CDC 2022 đầy đủ, có cảnh báo mốc cũ đã lỗi thời) |
| kiem-soat-dau-tummy-time-va-lay | DONE |
| voi-nam-do-vat-va-chuan-bi-ngoi | DONE (ghi rõ chênh lệch 6mo cũ vs 9mo CDC mới) |
| doc-bieu-do-tang-truong-dung-cach | DONE |
| tiem-chung-2-4-thang-va-thuoc-ha-sot-truoc-khi-tiem | DONE (lịch VN mức tin cậy vừa phải) |
| quay-khoc-va-trao-nguoc-khi-nao-het | DONE |
| be-bap-be-va-phat-trien-ngon-ngu-som | DONE |

⚠️ Cần rà soát riêng: `choi-va-phat-trien-1-3-thang` và `phat-trien-3-6-thang` (đã có trước
batch này) — nên kiểm tra lại có dùng mốc tuổi cũ (pre-2022) hay không.

---

## BATCH 7 — TRẺ 6–12 THÁNG (hoàn tất giai đoạn 1)

10 bài mới. `npm test` 9/9 pass, `npm run typecheck` sạch.

| Slug | Status |
|---|---|
| an-dam-be-tu-chi-huy-blw-vs-an-dam-truyen-thong | DONE (CONFLICTING_EVIDENCE sắt/tăng trưởng đã ghi rõ) |
| phan-biet-oe-va-hoc-khi-an-dam | DONE |
| nuoc-uong-cho-be-6-12-thang | DONE |
| do-tho-thuc-an-tu-nhuyen-den-lon-cop-va-cua-so-quan-trong | DONE |
| van-dong-tho-6-12-thang-ngoi-bo-dung-vin-di-men | DONE (mốc CDC mới đầy đủ: ngồi 9mo, bò đã bị bỏ khỏi bảng, đi 15-18mo) |
| xe-tap-di-co-banh-vi-sao-nen-tranh | DONE |
| nhan-thuc-xa-hoi-6-12-thang-do-vat-va-lo-au-nguoi-la | DONE |
| ngon-ngu-6-12-thang-tu-dau-tien-va-tre-song-ngu | DONE |
| sua-tiep-tuc-sau-an-dam-va-chuyen-sang-sua-bo | DONE |
| moc-rang-anh-huong-an-uong-cua-be | DONE (evidence LIMITED — khoảng trống giữa NC và tài liệu chính thức) |

---

## BATCH 8 — TRẺ 1–3 TUỔI (hoàn tất giai đoạn 1)

8 bài mới. `npm test` 9/9 pass, `npm run typecheck` sạch.

| Slug | Status |
|---|---|
| moc-van-dong-tho-15-36-thang | DONE |
| moc-van-dong-tinh-va-tay-thuan-15-36-thang | DONE (sửa lại mốc tay thuận sớm: 6-8mo, không phải 12-18mo) |
| tap-ngoi-bo-ban-ngay-ban-dem-va-khi-be-quay-lai-thoi-quen-cu | DONE (NHS vs AAP khác biệt đã ghi rõ) |
| cham-soc-rang-mieng-tre-nho | DONE (nguồn AAPD toàn văn) |
| ngon-ngu-18-36-thang-cum-hai-tu-va-lam-theo-huong-dan | DONE |
| thoi-gian-man-hinh-cho-tre-nho-who-va-aap-khac-biet-moi | DONE (⚠️ chính sách AAP 2026 chưa fetch được toàn văn, cần xác nhận lại) |
| ky-luat-tich-cuc-bang-chung-thuc-te | DONE |
| sang-loc-tu-ky-m-chat-18-24-thang | DONE (AAP vs USPSTF ghi rõ) |

Chưa nghiên cứu: dinh dưỡng kén ăn chuyên sâu — để dành Batch 9 (Dinh dưỡng); an toàn xe hơi/
ghế ngồi ô tô chi tiết — để dành Batch 11 (Sơ cứu & An toàn).

---

## BATCH 9 — DINH DƯỠNG CHUYÊN SÂU (hoàn tất giai đoạn 1)

13 bài mới. `npm test` 9/9 pass, `npm run typecheck` sạch.

| Slug | Status |
|---|---|
| an-ca-bien-an-toan-khi-mang-thai | DONE |
| caffeine-khi-mang-thai | DONE (CONFLICTING: Cochrane 2015 vs quan sát mới hơn, đã ghi rõ) |
| iot-khi-mang-thai-va-cho-con-bu | DONE (CONFLICTING số khuyến nghị WHO vs CDC/NIH; số liệu Việt Nam thực tế) |
| choline-duong-chat-de-bi-bo-quen-khi-mang-thai | DONE |
| vitamin-b12-va-che-do-an-chay-khi-mang-thai | DONE |
| thao-duoc-khi-mang-thai-nhung-dieu-can-biet | DONE (hoa cúc: an toàn "chưa được biết" theo chính NCCIH) |
| thao-duoc-loi-sua-that-hu | DONE (Cochrane: chỉ bằng chứng độ tin cậy thấp cho mọi loại) |
| chat-tao-ngot-nhan-tao-khi-mang-thai-cho-con-bu | DONE (CONFLICTING: FDA vs WHO 2023, đã ghi rõ không thiên vị) |
| rau-ngot-dua-du-du-xanh-khi-mang-thai-that-hu | DONE (đu đủ xanh/chín: bằng chứng động vật, chưa có nghiên cứu người) |
| nuoc-dua-me-den-hai-san-co-vo-khi-mang-thai | DONE |
| do-cay-do-lanh-khi-mang-thai | DONE (đồ lạnh: khoa học chưa từng nghiên cứu theo hướng nào) |
| che-do-an-cua-me-anh-huong-den-be-bu-me-nhu-the-nao | DONE (dị ứng đạm sữa bò: hiện tượng thật, hẹp — phân biệt rõ với quan niệm dân gian) |
| kieng-khem-sau-sinh-truyen-thong-va-khoa-hoc | DONE (dữ liệu khu vực Lào, không phải Việt Nam cụ thể) |

Chưa nghiên cứu: dinh dưỡng cho trẻ kén ăn 1-3 tuổi (ăn dặm/BLW đã có ở Batch 6-7, nhưng chưa
có bài riêng cho biếng ăn sinh lý ở tuổi tập đi); dị ứng thực phẩm ở trẻ (giới thiệu sớm đậu
phộng/trứng theo LEAP — chưa có bài riêng, có thể đưa vào Batch 14 FAQ hoặc một batch bổ sung).

---

## BATCH 10 — TIÊM CHỦNG CHI TIẾT (hoàn tất giai đoạn 1)

10 bài mới. `npm test` 9/9 pass, `npm run typecheck` sạch.

| Slug | Status |
|---|---|
| lich-tiem-chung-mo-rong-tcmr-chi-tiet-theo-thang-tuoi | DONE (⚠️ đối chiếu nguồn thứ cấp, chưa đọc trực tiếp Thông tư 52/2025/TT-BYT) |
| so-sanh-lich-tiem-chung-viet-nam-va-quoc-te | DONE |
| vac-xin-dich-vu-pho-bien-cho-tre-nho-phe-cau-nao-mo-cau-cum | DONE (phế cầu: thí điểm 2025-2026, toàn quốc ~2030) |
| vac-xin-hpv-va-covid-19-cho-tre-hien-trang-va-tranh-cai | DONE (CONFLICTING: CDC 1 liều HPV vs AAP 2 liều; COVID Mỹ đang tranh cãi) |
| phan-ung-sau-tiem-binh-thuong-va-dau-hieu-can-di-kham-ngay | DONE |
| chong-chi-dinh-hoan-tiem-va-sot-nhe-co-can-hoan-khong | DONE (ngưỡng số cụ thể theo QĐ 1575/QĐ-BYT) |
| lich-tiem-cham-dan-cach-co-an-toan-hon-khong | DONE (Hambidge 2014: trì hoãn MMR tăng nguy cơ co giật do sốt) |
| dich-soi-bach-hau-tai-viet-nam-bai-hoc-khoang-trong-tiem-chung | DONE (dữ liệu huyết thanh học TP.HCM 2024 thật) |
| su-co-quinvaxem-2012-va-niem-tin-vao-vaccine | DONE (case study niềm tin vaccine, dữ liệu tỷ lệ tiêm giảm thật) |
| mmr-tu-ky-thanh-phan-vaccine-va-qua-tai-mien-dich-su-that | DONE (Wakefield fraud, thimerosal, nhôm — bằng chứng lớn nhất 2025 không xác nhận tín hiệu hen suyễn trước đó) |

Chưa nghiên cứu: chi tiết hơn về não mô cầu/phế cầu theo từng sản phẩm cụ thể; dữ liệu dịch ho
gà tại Việt Nam (chỉ có dữ liệu bao phủ tiêm chủng, chưa có số ca dịch cụ thể).

---

## BATCH 11 — SƠ CỨU & AN TOÀN (hoàn tất giai đoạn 1)

13 bài mới. `npm test` 9/9 pass, `npm run typecheck` sạch. Batch có yêu cầu độ chính xác cao
nhất dự án — mọi kỹ thuật/liều lượng/số điện thoại đều đối chiếu Tier A/B, không suy đoán.

| Slug | Status |
|---|---|
| so-cuu-hoc-nghen-cho-tre-duoi-va-tren-1-tuoi | DONE (cập nhật hướng dẫn AHA/AAP 10/2025) |
| hoi-suc-tim-phoi-cpr-cho-tre-so-sinh-va-tre-nho | DONE (cập nhật kỹ thuật ép ngực + mốc dậy thì thay 8 tuổi) |
| phong-ngua-duoi-nuoc-va-xu-tri-khi-tre-duoi-nuoc | DONE (bác bỏ dứt khoát "đuối nước khô"; số liệu VN thật) |
| xu-tri-khan-cap-khi-phat-hien-tre-bat-tinh-luc-ngu | DONE (bổ sung mốc ngừng quấn theo phát triển) |
| so-cuu-bong-cho-tre-em | DONE (CONFLICTING: NHS 20 phút vs AAP/ABA tối thiểu 5 phút) |
| nga-va-chan-thuong-dau-o-tre-khi-nao-can-di-kham | DONE (sửa quan niệm "không được để trẻ ngủ") |
| so-cuu-ngo-doc-o-tre-em | DONE (⚠️ không đưa số ĐT trung tâm chống độc — chưa xác minh được) |
| nuot-phai-pin-cuc-ao-va-di-vat-nho-cap-cuu-khan-cap | DONE (mật ong: điều kiện chặt chẽ, không thay ER) |
| ghe-ngoi-o-to-cho-tre-em-tai-viet-nam | DONE (luật VN mới 1/7/2026, đang điều chỉnh mức phạt) |
| an-toan-xe-may-cho-tre-em-tai-viet-nam | DONE |
| an-toan-trong-nha-nguy-co-thuong-gap | DONE (⚠️ thiếu số liệu VN cụ thể cho bỏng/té ngã ban công) |
| lieu-dung-thuoc-ha-sot-an-toan-cho-tre | DONE (CONFLICTING: xen kẽ paracetamol-ibuprofen) |
| khi-nao-goi-cap-cuu-115-va-cach-xu-tri-phan-ve | DONE (⚠️ 115 có thể hợp nhất thành 113 từ ~2027) |

Chưa nghiên cứu: sơ cứu điện giật, ngộ độc thực phẩm chi tiết theo tác nhân cụ thể, an toàn hồ
bơi chi tiết hơn (đã có khung phòng ngừa chung trong bài đuối nước).

---

## BATCH 12 — THỰC HÀNH DÂN GIAN VIỆT NAM, MỞ RỘNG (hoàn tất giai đoạn 1)

14 bài mới. `npm test` 9/9 pass, `npm run typecheck` sạch.

| Slug | Status |
|---|---|
| nam-than-nam-lua-sau-sinh-nguy-hiem-that | DONE (⚠️ có ca tử vong thật tại Việt Nam + Brunei) |
| tam-la-xong-hoi-la-cho-me-va-be-so-sinh | DONE |
| kieng-tam-goi-sau-sinh-that-hu | DONE |
| nan-vu-tre-so-sinh-va-ro-luoi-bang-mat-ong | DONE |
| thoi-diem-tam-be-so-sinh-lan-dau-theo-who | DONE (MODERATE — độ tin cậy bằng chứng nền còn thấp-vừa) |
| cao-gio-giac-hoi-o-tre-em-nguy-co-va-nham-lan-bao-hanh | DONE (⚠️ 1 nguồn URL suy luận theo mẫu) |
| giat-kinh-phong-va-so-cuu-dan-gian-nguy-hiem-khi-tre-co-giat | DONE (⚠️ 1 nguồn chưa xác minh URL bài viết cụ thể) |
| quan-niem-via-va-ho-tro-tam-linh-khi-be-quay-khoc | DONE (xử lý như văn hóa, không gán nhãn khoa học) |
| quan-niem-moc-rang-gay-sot-va-do-choi-moc-rang-nguy-hiem | DONE |
| nan-mui-cho-cao-va-quan-cha-chan-thang-chong-vong-kieng | DONE (phát hiện quan trọng: nguy cơ DDH thật) |
| bu-bam-moi-khoe-ep-an-va-tap-ngoi-dung-som | DONE |
| le-day-thang-thoi-noi-y-nghia-va-luu-y-thuc-te | DONE (thuần văn hóa, không gán nhãn khoa học) |
| du-doan-gioi-tinh-thai-nhi-theo-dan-gian-that-hu | DONE (phân biệt rõ đã-bác-bỏ vs chưa-kiểm-chứng) |
| kieng-cu-xa-hoi-sau-sinh-va-suc-khoe-tam-than-cua-me | DONE (⚠️ bằng chứng khu vực TQ/Hàn, chưa có dữ liệu Việt Nam) |

Chưa nghiên cứu: các thực hành dân gian khác về nuôi con (cho bé bú theo giờ cố định kiểu cũ,
quan niệm về "vía" ảnh hưởng đến giấc ngủ theo hướng cụ thể hơn); có thể bổ sung ở Batch 13/14
nếu phát sinh trong quá trình tổng hợp myth-vs-fact/FAQ.

---

## BATCH 13 — MYTH VS FACT (hoàn tất giai đoạn 1)

4 bài mới (mỗi bài gộp 6 huyền thoại theo định dạng CLAIM/VERDICT/EXPLANATION), tổng 24 huyền
thoại. `npm test` 9/9 pass, `npm run typecheck` sạch.

| Slug | Status |
|---|---|
| myth-vs-fact-thai-ky-va-chuyen-da | DONE (6 huyền thoại: ợ nóng-tóc, dây rốn, quan hệ, ngày dự sinh, gây chuyển dạ, gây tê) |
| myth-vs-fact-cho-con-bu-va-co-the-sau-sinh | DONE (6 huyền thoại: ngực nhỏ, vệ sinh núm vú, chảy xệ, LAM, bó bụng, stress-mất sữa) |
| myth-vs-fact-giac-ngu-an-uong-moc-phat-trien-cua-be | DONE (6 huyền thoại: bế nhiều-hư, đọc sách sớm, wake window, bú hết bình, mốc đi 18mo, cry-it-out) |
| myth-vs-fact-sua-me-tang-truong-moc-rang-tiem-chung | DONE (6 huyền thoại: đường-tăng động, sữa loãng, bụ bẫm-béo phì, mọc răng-IQ, dồn vắc-xin, ướt tóc-cảm lạnh) |

Chưa nghiên cứu: có thể còn nhiều huyền thoại lẻ khác sẽ tự nhiên xuất hiện khi tổng hợp Batch
14 (Parent FAQ) — sẽ bổ sung dạng myth-vs-fact ngắn gọn trong câu trả lời FAQ nếu phù hợp thay
vì tạo thêm bài riêng.

---

## BATCH 14 — PARENT FAQ (hoàn tất giai đoạn 1) — BATCH CUỐI CÙNG CỦA DỰ ÁN

5 bài mới (24 câu hỏi thực tế dạng Hỏi-Đáp). `npm test` 9/9 pass, `npm run typecheck` sạch.

| Slug | Status |
|---|---|
| faq-tinh-huong-thuc-te-o-tre-so-sinh | DONE (6 câu: nấc cụt, đảo ngày-đêm, rốn/tắm, vàng da, hăm tã, đầy hơi) |
| faq-an-uong-hanh-vi-phat-trien-tre-tap-di | DONE (6 câu: biếng ăn, táo bón, cắn bạn, nói lắp, ti giả, ăn vạ) |
| faq-thai-ky-om-nghen-nang-va-tieu-duong-thai-ky | DONE (2 câu: hyperemesis, tiểu đường thai kỳ) |
| faq-hau-san-tap-the-duc-nut-num-vu-ho-tro-tram-cam | DONE (4 câu: tập thể dục, nứt núm vú, hỗ trợ gia đình, baby blues/PPD) |
| faq-nha-tre-om-co-nen-di-hoc-anh-chi-em-di-xa-cung-be | DONE (6 câu: tuổi đi nhà trẻ, ốm-đi học, chuẩn bị có em, tranh giành, đi máy bay) |

---

# TỔNG KẾT TOÀN DỰ ÁN (sau khi hoàn tất cả 14 batch)

## Quy mô cuối cùng
- **197 bài viết** (`curatedArticles`) trong `src/features/knowledge/articles.ts`.
- **~523 nguồn** (`sources`) — mỗi nguồn có organization/title/url/evidenceTier bằng tiếng Việt.
- `npm test -- src/features/knowledge`: 9/9 pass. `npm run typecheck`: sạch, xuyên suốt 14 batch.

## Phân bổ theo evidenceLevel
STRONG 111 · MODERATE 66 · TRADITIONAL 6 · LIMITED 5 · POTENTIALLY_HARMFUL 9.
(Lưu ý: schema `EvidenceLevel` không có `CONFLICTING_EVIDENCE` — mọi xung đột giữa các tổ chức
y tế lớn được diễn giải bằng văn xuôi trong `content`, đánh dấu rõ "Điểm CONFLICTING_EVIDENCE"
trong SOURCES.md thay vì gán vào trường enum.)

## Phân bổ theo knowledgeType
SCIENTIFIC_GUIDELINE 177 · TRADITIONAL_PRACTICE 11 · POTENTIALLY_HARMFUL 9.

## Phân bổ theo stage (mọi giá trị enum đều có bài, đúng yêu cầu test)
PREGNANCY 45 · POSTPARTUM 39 · NEWBORN_0_28_DAYS 35 · TODDLER 25 · INFANT_6_12_MONTHS 23 ·
INFANT_1_3_MONTHS 22 · INFANT_3_6_MONTHS 5 · PRECONCEPTION 3.

## 14 batch đã hoàn thành
1. Newborn 0-28 ngày · 2. Nuôi con bằng sữa mẹ · 3. Thai kỳ · 4. Chuyển dạ & sinh nở ·
5. Hậu sản · 6. Trẻ 1-6 tháng · 7. Trẻ 6-12 tháng · 8. Trẻ 1-3 tuổi · 9. Dinh dưỡng chuyên sâu ·
10. Tiêm chủng chi tiết · 11. Sơ cứu & An toàn · 12. Thực hành dân gian Việt Nam mở rộng ·
13. Myth vs Fact · 14. Parent FAQ.

## Các điểm CONFLICTING_EVIDENCE / khác biệt guideline lớn xuyên suốt dự án (xem chi tiết đầy
đủ theo batch trong SOURCES.md — đây chỉ là các điểm nổi bật nhất)
- Bảng mốc phát triển CDC bị sửa đổi lớn 2021-2022 (ngưỡng bách phân vị 50%→75%): đi độc lập
  12→18 tháng, bò bị loại khỏi bảng, nói cụm 2 từ 18→24 tháng.
- Vắc-xin: hướng dẫn hóc nghẹn/CPR của AHA/AAP vừa đổi lớn (10/2025); lịch tiêm chủng Mỹ đang
  tranh chấp pháp lý thật giữa ACIP/AAP (2025-2026).
- Caffeine, chất tạo ngọt, aspirin cho trẻ dưới 6 tháng, thời gian xả nước khi bỏng (NHS 20 phút
  vs AAP/ABA tối thiểu 5 phút): khác biệt thật giữa các cơ quan y tế lớn, không phải sai sót.
- Nhiều thực hành dân gian Việt Nam được xác nhận có hại thật bằng ca việc thật (nằm than gây tử
  vong do ngộ độc CO; quấn chân thẳng là yếu tố nguy cơ thật của loạn sản khớp háng).

## Khoảng trống còn lại / cần nghiên cứu thêm nếu mở rộng dự án
- Một số URL bị suy luận theo mẫu (chưa xác minh 100%) được đánh dấu ⚠️ rải rác trong SOURCES.md
  theo từng batch — nên có một lượt rà soát cuối cùng bởi người có quyền truy cập đầy đủ trước
  khi đưa nội dung ra công khai/sản xuất.
- Số điện thoại Trung tâm Chống độc Bạch Mai chưa xác minh được — app chỉ dùng số 115.
- Số 115 tại Việt Nam có kế hoạch hợp nhất thành 113 (~2027) — cần cập nhật lại khi có thay đổi.
- Vietnam-specific: dữ liệu dịch ho gà cụ thể, thống kê bỏng nước nóng/té ngã ban công tại Việt
  Nam, nghiên cứu dịch tễ trực tiếp về kiêng cữ và trầm cảm sau sinh tại Việt Nam đều chưa có —
  hiện dùng bằng chứng khu vực/quốc tế gần nhất thay thế, đã ghi chú rõ trong nội dung.
- Batch 8 gợi ý cần một lượt review lại 2 bài viết trước dự án này (`choi-va-phat-trien-1-3-thang`,
  `phat-trien-3-6-thang`) để khớp với mốc phát triển đã hiệu chỉnh — chưa thực hiện, ngoài phạm
  vi batch bổ sung (chỉ sửa nội dung MỚI, không unilaterally sửa nội dung đã xuất bản trước đó).

---

_Dự án 14 batch hoàn tất theo yêu cầu "hoàn thành tất cả các batch còn lại luôn nhé". Toàn bộ
197 bài đã qua `npm test` + `npm run typecheck` sau mỗi batch, không có batch nào bị bỏ qua bước
kiểm tra này._

---

_Cập nhật lần cuối: sau khi hoàn tất giai đoạn 1 của Batch 1 (12 bài mới đã vào `articles.ts`,
test + typecheck pass). Đang chờ người dùng review trước khi tiếp tục Batch 2 theo yêu cầu._
