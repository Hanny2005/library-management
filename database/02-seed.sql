-- =====================================================================
-- DỮ LIỆU BAN ĐẦU (tuỳ chọn) — thể loại + sách để thư viện không trống.
-- Chạy SAU 01-schema.sql. Chạy lại không bị trùng (bỏ qua dòng đã có).
-- Admin có thể sửa/xoá các sách này trên trang Quản lý sách sau này.
-- =====================================================================

insert into public.categories (name, description)
select v.name, v.description
from (values
  ('Văn học',      'Tiểu thuyết, truyện ngắn và tác phẩm kinh điển'),
  ('Khoa học',     'Khoa học tự nhiên và xã hội'),
  ('Công nghệ',    'Lập trình và kỹ thuật phần mềm'),
  ('Kinh tế',      'Tài chính, đầu tư, kinh doanh'),
  ('Kỹ năng sống', 'Phát triển bản thân'),
  ('Thiếu nhi',    'Sách cho trẻ em và thiếu niên')
) as v(name, description)
where not exists (select 1 from public.categories c where lower(c.name) = lower(v.name));

insert into public.books (title, author, description, quantity, available_quantity, category_id, cover_url)
select v.title, v.author, v.description, v.qty, v.qty,
       (select c.id from public.categories c where c.name = v.category),
       'https://covers.openlibrary.org/b/isbn/' || v.isbn || '-L.jpg'
from (values
  ('The Midnight Library', 'Matt Haig', 'Giữa sự sống và cái chết có một thư viện. Mỗi cuốn sách trên kệ là một cơ hội sống thử một cuộc đời khác.', 8, 'Văn học', '9780525559474'),
  ('Atomic Habits', 'James Clear', 'Phương pháp xây dựng thói quen tốt và loại bỏ thói quen xấu bằng những thay đổi nhỏ, nhất quán mỗi ngày.', 10, 'Kỹ năng sống', '9780735211292'),
  ('Sapiens', 'Yuval Noah Harari', 'Lược sử loài người qua ba cuộc cách mạng: nhận thức, nông nghiệp và khoa học.', 6, 'Khoa học', '9780062316097'),
  ('Clean Code', 'Robert C. Martin', 'Cẩm nang viết mã sạch: đặt tên, hàm, chú thích, xử lý lỗi và kiểm thử.', 5, 'Công nghệ', '9780132350884'),
  ('The Pragmatic Programmer', 'David Thomas, Andrew Hunt', 'Những bài học thực tiễn giúp lập trình viên trưởng thành.', 4, 'Công nghệ', '9780135957059'),
  ('Dune', 'Frank Herbert', 'Sử thi khoa học viễn tưởng về hành tinh sa mạc Arrakis, quyền lực và sinh thái.', 7, 'Văn học', '9780441172719'),
  ('1984', 'George Orwell', 'Tiểu thuyết phản địa đàng về một xã hội bị giám sát toàn diện.', 9, 'Văn học', '9780451524935'),
  ('The Psychology of Money', 'Morgan Housel', 'Mười chín câu chuyện ngắn về cách con người nghĩ và hành xử với tiền bạc.', 6, 'Kinh tế', '9780857197689'),
  ('Thinking, Fast and Slow', 'Daniel Kahneman', 'Hai hệ thống tư duy chi phối quyết định của con người.', 5, 'Khoa học', '9780374533557'),
  ('The Alchemist', 'Paulo Coelho', 'Hành trình theo đuổi giấc mơ của chàng chăn cừu Santiago.', 12, 'Văn học', '9780062315007'),
  ('Harry Potter và Hòn đá Phù thủy', 'J.K. Rowling', 'Cậu bé Harry phát hiện mình là phù thủy và bước vào trường Hogwarts.', 10, 'Thiếu nhi', '9780590353427'),
  ('Educated', 'Tara Westover', 'Hồi ký của người phụ nữ chưa từng đến trường và tự học đến tiến sĩ.', 4, 'Kỹ năng sống', '9780399590504')
) as v(title, author, description, qty, category, isbn)
where not exists (select 1 from public.books b where lower(b.title) = lower(v.title));
