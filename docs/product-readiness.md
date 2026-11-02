# Dùng Vani Family trong gia đình

Ứng dụng dành riêng cho hai vợ chồng. Cả hai đăng nhập cùng tài khoản trên điện thoại riêng,
cùng xem nhật ký của bé và hồ sơ của mẹ. Không cần tài khoản thành viên, lời mời, gói dịch vụ hay chức năng thương mại.

## Thao tác hằng ngày

- Mở Hôm nay để xem cữ bú gần nhất, tổng giấc ngủ và số lần thay tã.
- Chọn Ghi cữ bú / Ghi giấc ngủ / Ghi thay tã để mở sẵn biểu mẫu. Nút micro cạnh tiêu đề hỗ trợ ghi bằng giọng nói.
- Bấm giờ bú/ngủ khi bắt đầu, kết thúc khi xong. Đồng hồ cập nhật từng giây.
- Mục Bàn giao chăm bé có tóm tắt để vợ hoặc chồng nắm nhanh tình hình; có thể sao chép nếu cần.
- Khi mở lại trang Hôm nay hoặc quay lại ứng dụng, dữ liệu được cập nhật. Khi trang đang hiện, ứng dụng làm mới định kỳ; đây không phải đồng bộ tức thời.
- Bật Ghi nhanh khi mất mạng trong Hồ sơ nếu cần lưu tạm bú/ngủ/tã trên thiết bị.
- Tìm cẩm nang, mở bài rồi quay lại vẫn giữ bộ lọc và từ khóa.
- Tiêm chủng mở sẵn danh sách theo tuổi và tên các mũi ở mốc tiếp theo. Tích tại từng mũi để ghi đã tiêm hôm nay, không mở form; các mũi sau vẫn hiện, mũi đã tiêm vẫn giữ trong danh sách kèm ngày. Sửa ngày / ghi chú khi cần, bỏ tích nếu nhầm. Dữ liệu cũ được nhận diện và không tự tạo lại. Ngày hẹn riêng vẫn lưu được ở phần Lịch hẹn; nếu đánh dấu mũi có hẹn tương ứng thì lịch đó ngừng được nhắc. Lịch tuổi là tham khảo, đối chiếu theo phiếu tiêm và cơ sở tiêm.
- Trong Của bé, mở Nhạc hát ru để nghe gợi ý theo nhóm tuổi của hồ sơ đang chọn. Chọn bài để mở trình phát; dùng Dừng phát hoặc hẹn dừng 10/20/30 phút. Hẹn dừng tính cho lượt nghe hiện tại và được giữ khi đổi bài; rời trang sẽ đóng trình phát. Nhạc MP3 phát trực tiếp trong ứng dụng, có bật/tắt lặp bài và nút tải MP3 để nghe bằng trình nghe nhạc của thiết bị khi ngoại tuyến. Các bản thu nằm trong `public/audio/lullabies/`, có ghi công và giấy phép từng bài.

## Điều hướng nhất quán

- Nút quay lại dùng lịch sử thực tế trong phiên ứng dụng, hỗ trợ Back/Forward.
- Truy cập trực tiếp hoặc tải lại: bản ghi về Của bé, trang của mẹ về Của mẹ, hồ sơ về Hồ sơ, bài viết về thư viện tương ứng.
- Khi đang sửa, Back đóng chế độ sửa trước. Lưu, hủy và tải thêm lịch sử không tạo vòng lặp quay lại biểu mẫu cũ.
- Các đường dẫn đã đi chỉ được giữ trong bộ nhớ, không ghi lịch sử sức khỏe vào localStorage.

## Những việc vẫn cần cho dữ liệu của gia đình

- Giữ bản sao lưu PostgreSQL và kiểm tra có thể khôi phục; không coi CSV là bản sao lưu toàn bộ ứng dụng.
- Đổi mật khẩu mặc định và không chia sẻ tài khoản ra ngoài hai vợ chồng.
- Nội dung cẩm nang còn các nguồn chưa xác minh ghi trong `knowledge/RESEARCH_STATUS.md`; phần mềm chạy đúng không đồng nghĩa mọi nội dung đã được duyệt chuyên môn.
- Nếu dùng AI, cấu hình provider khi cần; không có provider thì ứng dụng vẫn ghi nhật ký bình thường.
- Kiểm tra thực tế trên hai điện thoại đang sử dụng, đặc biệt micro, thông báo và chế độ mất mạng. Các kiểm thử trình duyệt tự động hiện tập trung vào Chrome.

## Kiểm tra kỹ thuật

Chạy lint, typecheck, unit tests, build và Playwright theo README.
`e2e/navigation.spec.ts` kiểm tra quay lại, chỉnh sửa/lưu, giữ bộ lọc và màn hình nhỏ.
`e2e/onboarding.spec.ts` chỉ chạy khi `E2E_EMPTY_FAMILY=1`, với tài khoản thử nghiệm riêng chưa có hồ sơ;
kịch bản sẽ tạo hồ sơ mẹ, thai kỳ và bé. Không chạy kịch bản này với dữ liệu thật của gia đình.

Trong môi trường không cho Turbopack mở cổng tiến trình CSS, có thể kiểm tra production bằng
`npx next build --webpack`.
