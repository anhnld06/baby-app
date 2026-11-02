# Rà soát trường nhập theo ngữ cảnh

Các trường ngoài phạm vi được ẩn và disabled, không tham gia FormData. Khi đổi lựa chọn rồi đổi lại trước khi lưu, giữ bản nháp. Schema phía server chuẩn hóa trường ngoài phạm vi thành null khi lưu/sửa; không chỉnh sửa hàng loạt lịch sử cũ.

| Form | Quy tắc |
| --- | --- |
| Cữ bú, kể cả xác nhận giọng nói | Bú mẹ: bên/phút; bình: lượng uống; công thức: tên sữa; kết hợp: cả hai nhóm. |
| Tã | Tã ướt không có màu/đặc tính/lượng phân; đi ngoài/cả hai mới hiện. |
| Bảo hiểm mẹ và bé | Nơi đăng ký khám ban đầu chỉ thuộc BHYT. Các thông tin hợp đồng khác dùng chung. |
| Hồ sơ thai kỳ | Dự định mang thai không hiện ngày dự sinh; ngày sinh thực tế chỉ khi đã sinh. Giữ ngày dự sinh lịch sử khi thai kỳ đã kết thúc. |
| Khám thai / siêu âm | Khám thường không hiện sinh trắc/nhau/ối/cổ tử cung/hình thái siêu âm; siêu âm riêng không hiện chỉ số của mẹ. Kết hợp hiện cả hai. Các ghi nhận thai chung, kết luận, lịch tái khám dùng chung. |
| Tăng trưởng | Chỉ hiện tư thế đo khi có chiều dài/chiều cao; xóa chiều cao cũng xóa tư thế khi lưu. |
| Giấc ngủ | Giấc ngày/đêm cùng dùng thời gian và nơi ngủ, không có trường riêng cần ẩn. Form giọng nói kết thúc giấc đã giới hạn trường theo thao tác. |
| Tiêm chủng | Lịch hẹn và lần đã tiêm đã tách ngữ cảnh ngày hẹn/ngày tiêm thực tế; thông tin bổ sung nằm trong mục mở rộng. |
| Sổ khám / đơn thuốc | Các trường áp dụng chung cho một lần khám/đơn thuốc; dòng thuốc tạo theo nhu cầu. |
| Hút sữa | Hai bên và thời lượng đều liên quan; cho phép bỏ trống bên không hút. Không tạo thêm lựa chọn chỉ để bật/tắt trường. |
| Hồ sơ mẹ/bé, chu kỳ | Các số liệu mô tả cùng hồ sơ/nhật ký, không suy diễn tuổi hay tình trạng sức khỏe để ẩn trường. |
