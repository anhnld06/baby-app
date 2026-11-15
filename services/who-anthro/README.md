# WHO Anthro adapter (standalone reference)

Ứng dụng hiện dùng bảng LMS nội bộ và bộ tính TypeScript; service này không còn là phụ thuộc runtime. Có thể chạy riêng để đối chiếu độc lập.

Service nội bộ này gọi package `anthro` chính thức của WHO và chỉ trả về
Z-score/quality flags. Không mở service trực tiếp ra Internet; đặt
`WHO_ANTHRO_TOKEN` giống với ứng dụng Next.js.

Package `anthro` được phân phối theo GPL-3.0. Khi phân phối image hoặc dịch vụ,
cần giữ thông tin giấy phép và tuân thủ điều khoản của package nguồn.
