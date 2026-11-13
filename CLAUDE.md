# CLAUDE.md

Project **Thư viện Tri Thức**: website quản lý thư viện.
React 19 + Vite + Tailwind 4 (`library-frontend/`), Spring Boot 3 / Java 21 (`library-backend/`, sắp có), Supabase PostgreSQL + Auth (`database/*.sql`).

- Trả lời người dùng bằng **tiếng Việt**. Người dùng dùng **Windows** + VS Code.
- Trước khi sửa code, đọc skill `.claude/skills/library-management/SKILL.md`. Skill có quy tắc nghiệp vụ, schema, hợp đồng API và quy ước code.
- Không đổi tên bảng/cột; không tin `user_id` từ frontend; kiểm tra quyền ADMIN ở backend.
- Không đưa secret key, `service_role` hay mật khẩu database vào code hoặc commit. Không yêu cầu người dùng gửi mật khẩu.
- Làm theo từng giai đoạn (xem bảng Tiến độ trong `README.md`). Code hoàn chỉnh, ghi rõ đường dẫn file.

Lệnh nhanh (trong `library-frontend/`): `npm install` · `npm run dev` · `npm run build`.
