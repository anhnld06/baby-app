<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Kiểm tra và sửa lỗi trước khi báo cáo

- Sau mỗi lần thêm hoặc sửa, phải kiểm tra phiên bản cuối, sửa các lỗi phát hiện được và chạy lại các kiểm tra bị ảnh hưởng trước khi báo hoàn tất.
- Với mã ứng dụng: chạy lint, kiểm tra TypeScript, production build và unit test liên quan. Build có kiểm tra TypeScript thành công có thể thay thế lệnh typecheck riêng.
- Với giao diện hoặc tương tác: chạy kiểm thử trình duyệt liên quan, kiểm tra lỗi console và xem giao diện ở kích thước màn hình bị ảnh hưởng.
- Khi đổi Prisma schema: regenerate client, khởi động lại server dev đang chạy và kiểm tra trang bị ảnh hưởng ngay trên server đó; kiểm thử trên server mới không phát hiện cache cũ của server người dùng.
- Với database: kiểm tra schema/migration và luồng lưu dữ liệu liên quan; không tự áp dụng migration phá hủy dữ liệu ngoài phạm vi công việc.
- Với thay đổi chỉ gồm tài liệu hoặc hướng dẫn: kiểm tra nội dung, liên kết, định dạng và validator phù hợp; không cần build ứng dụng nếu hành vi thực thi không thay đổi.
- Nếu thiếu lệnh trong PATH, tìm runtime cục bộ trước. Node/npm trên máy này có tại `/Users/chaunhb/.local/share/vani-local-runtime/node/bin`.
- Không ghi đè thay đổi sẵn có của người dùng để làm kiểm tra vượt qua. Nếu có lỗi chưa sửa được hoặc kiểm tra bị chặn, phải báo rõ lỗi, nguyên nhân và phần chưa xác minh; không kết luận đã hoàn tất hoặc hết lỗi.
- Báo cáo cuối phải nêu thay đổi và kết quả kiểm tra thực tế, phân biệt kiểm tra đạt với kiểm tra bị bỏ qua.

Skill chi tiết: [baby-app-quality](/Users/chaunhb/.codex/skills/baby-app-quality/SKILL.md).
