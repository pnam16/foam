# ✅ Checklist Review Code Java Web

Checklist cơ bản để review code cho các dự án Java Web, tập trung vào các khía cạnh chính: **Bảo mật, Hiệu năng, Rò rỉ tài nguyên, và Khả năng bảo trì**.

---

## 🔴 **Must**: Bắt buộc tuân thủ, cực kỳ quan trọng.

### 🔒 Security (Bảo mật)

- **[ ] Không lưu thông tin nhạy cảm trong code, properties, yaml :** Mật khẩu, API keys, tokens, v.v., phải được quản lý qua biến môi trường hoặc các dịch vụ quản lý cấu hình an toàn.
- **[ ] Chống SQL Injection:** Luôn sử dụng `PreparedStatement` với tham số `?` hoặc các thư viện ORM (JPA, Hibernate) một cách an toàn.
- **[ ] Chống Log Injection:** Làm sạch (sanitize) dữ liệu do người dùng nhập vào trước khi ghi log. Tránh ghi ra log các dữ liệu như mật khẩu, token, số thẻ tín dụng, hoặc thông tin định danh cá nhân (PII).
- **[ ] Bảo vệ tất cả các API Endpoint:** Đảm bảo tất cả các API đều được áp dụng cơ chế xác thực và phân quyền, trừ những API được chủ đích công khai.
- **[ ] Chống Cross-Site Scripting (XSS):** Sanitize (escape html) tất cả dữ liệu từ người dùng trước khi hiển thị trên giao diện người dùng. Ví dụ : Một đoạn code js output alert được user nhập vào text field trên màn hình, sau đó khi access màn hình view detail thì đoạn code alert bị thực thi và hiển thị lên giao diện. Do chưa thực hiện sanitize data ở BE trước khi output ra cho FE.
- **[ ] Chống Cross-Site Request Forgery (CSRF):** Sử dụng token chống CSRF cho tất cả các request thay đổi trạng thái hệ thống (POST, PUT, DELETE). Ví dụ : Trong cấu hình SecurityConfig của Spring đang disable csrf **(csrf().disable())**.
- **[ ] Sử dụng thuật toán mã hóa mạnh:** Tránh các thuật toán lỗi thời và không an toàn (ví dụ: MD5, SHA1, DES). Ưu tiên sử dụng **AES-256, RSA-2048+, SHA-256** hoặc cao hơn.
- **[ ] Sử dụng chế độ mã hóa an toàn:** Khi dùng mã hóa khối (block cipher) như AES, hãy sử dụng các chế độ an toàn như **GCM** hoặc CCM. **Tránh sử dụng chế độ ECB** vì nó không an toàn.
- **[ ] Quản lý phiên (Session) an toàn:**
  - Sử dụng session ID an toàn, dài, và ngẫu nhiên.
  - Thiết lập thời gian timeout hợp lý cho session.
  - Hủy session (invalidate) sau khi người dùng đăng xuất.
- **[ ] Xử lý file upload an toàn:**
  - Kiểm tra loại file và kích thước file.
  - Không lưu file được upload trong thư mục gốc của dự án.
  - Không cấp quyền thực thi cho thư mục chứa file upload. (file upload được để cùng thư mục với thư mục source code hoặc thư mục file upload có quyền execute (+x) trên server. Quyền an toàn thường là 644 cho file và 755 cho thư mục.)

---

### 🚀 Performance (Hiệu năng)

- **[ ] Tối ưu hóa truy vấn cơ sở dữ liệu:**
  - Tránh vấn đề **N+1 query** bằng cách sử dụng `JOIN FETCH` hoặc batch loading.
  - Đảm bảo các cột được dùng trong mệnh đề `WHERE` đã được đánh **index**. Thứ tự cột ở mệnh đề where phải phù hợp với thứ tự đã đánh **index**
  - Chỉ `SELECT` những cột cần thiết, tránh dùng `SELECT *`.

---

### 💧 Resource Leakage (Rò rỉ tài nguyên)

- **[ ] Luôn đóng kết nối và stream:**
  - Sử dụng cú pháp **`try-with-resources`** cho `Connection`, `Statement`, `ResultSet`, và tất cả các luồng I/O.
  - Nếu không dùng `try-with-resources`, phải đảm bảo chúng được đóng trong khối `finally`.
- **[ ] Quản lý Transaction chặt chẽ:**
  - Mỗi transaction được `begin()` phải kết thúc bằng `commit()` (khi thành công) hoặc `rollback()` (khi có lỗi).
  - Tránh để transaction treo quá lâu, gây giữ lock tài nguyên.
- **[ ] Sử dụng Connection Pool:** Luôn sử dụng một thư viện connection pool (như HikariCP) để quản lý kết nối cơ sở dữ liệu.

---

### 📜 Convention & Maintainable (Quy tắc và Khả năng bảo trì)

- **[ ] Xử lý Null Pointer:** Luôn kiểm tra các đối tượng có thể `null` trước khi sử dụng. Cân nhắc sử dụng `Optional` (từ Java 8).
- **[ ] Dọn dẹp code thừa:** Xóa các `import`, biến (variables), hoặc phương thức không bao giờ được sử dụng.
- **[ ] Tuân thủ quy tắc đặt tên (Naming Convention):**
  - Class: `UpperCamelCase`
  - Method/Variable: `lowerCamelCase`
  - Constant: `UPPER_SNAKE_CASE`.
- **[ ] Xử lý Exception đúng cách:**
  - Không "nuốt" exception (để trống khối `catch`). Ít nhất phải ghi log lại lỗi. Nên output thêm stacktrace để dễ debug khi có lỗi Runtime.
  - Ném ra các exception cụ thể, có ý nghĩa.
- **[ ] Sử dụng Logging Framework:** Dùng SLF4J với Logback/Log4j2 thay vì `System.out.println()`.

---

## 🟡 **Should**: Nên tuân thủ, đảm bảo chất lượng.

### 🔒 Security (Bảo mật)

- N/A

---

### 🚀 Performance (Hiệu năng)

- **[ ] Sử dụng Caching:** Cache lại những dữ liệu ít thay đổi nhưng được truy cập thường xuyên.
- **[ ] Sử dụng Collection hiệu quả:** Lựa chọn đúng loại Collection cho từng mục đích (ví dụ: `HashSet` để kiểm tra sự tồn tại, `ArrayList` để truy cập theo chỉ mục).
- **[ ] Tránh tạo đối tượng không cần thiết trong vòng lặp:** Tái sử dụng đối tượng nếu có thể để giảm tải cho Garbage Collector (GC).
- **[ ] Nối chuỗi hiệu quả:** Sử dụng `StringBuilder` thay vì toán tử `+` khi nối nhiều chuỗi trong vòng lặp.

---

### 💧 Resource Leakage (Rò rỉ tài nguyên)

- **[ ] Giải phóng tài nguyên sớm nhất có thể:** Nên set null hoặc clear data cho các object, collection ngay sau khi sử dụng xong. Đặc biệt các xử lý có xử lý nhiều data và trong thời gian dài như job, batch.
- **[ ] Đảm bảo các `ExecutorService` (thread pool) được shutdown đúng cách khi không còn sử dụng.**
- **[ ] Hạn chế lưu trữ đối tượng lớn trong `HttpSession` để tránh tiêu tốn bộ nhớ không cần thiết.**

---

### 📜 Convention & Maintainable (Quy tắc và Khả năng bảo trì)

- **[ ] Giảm độ phức tạp (Cognitive Complexity). Đảm bảo độ phức tạp của các hàm số không vượt quá 15 :** Hạn chế lồng ghép quá nhiều `if/else`, `switch`, `for`, `while` trong một phương thức. **Refactor** các phương thức phức tạp thành các phương thức nhỏ hơn, đơn nhiệm.
- **[ ] Không lặp code (Don't Repeat Yourself - DRY):**
  - Tách các đoạn code lặp lại thành các phương thức chung.
  - Định nghĩa **hằng số (constant)** thay vì lặp lại các giá trị cố định (magic numbers/strings).
- **[ ] Luôn có `default` case trong câu lệnh `switch`:** Điều này giúp xử lý các trường hợp không mong muốn và làm cho code an toàn hơn.
- **[ ] Sử dụng Generics đúng cách:** Tránh dùng **raw types** (ví dụ: `List` thay vì `List<String>`). Sử dụng bounded wildcards (`<? extends Type>`) một cách hợp lý.
- **[ ] Sử dụng `replace` thay vì `replaceAll`:** Khi chỉ cần thay thế chuỗi ký tự cố định, hãy dùng `replace()`. `replaceAll()` chỉ nên dùng khi cần đến biểu thức chính quy (regex).
- **[ ] Xử lý lớp Serializable:** Các trường không cần tuần tự hóa trong một lớp `Serializable` nên được đánh dấu là **`transient`**.

---

## 🟢 **Could**: Có thể có, giúp code hoàn thiện hơn.

### 🔒 Security (Bảo mật)

- N/A

---

### 🚀 Performance (Hiệu năng)

- **[ ] Khởi tạo kích thước ban đầu cho Collection nếu biết trước (ví dụ: `new ArrayList<>(capacity)`).**
- **[ ] Sử dụng kiểu dữ liệu nguyên thủy (primitive) thay vì Wrapper (ví dụ: `int` thay vì `Integer`) khi có thể để giảm boxing/unboxing.**
- **[ ] Sử dụng `EnumSet` hoặc `EnumMap` khi làm việc với tập hợp/bản đồ mà key là Enum.**

---

### 💧 Resource Leakage (Rò rỉ tài nguyên)

- **[ ] Kiểm tra việc quản lý connection pool của các HTTP Client (ví dụ: Apache HttpClient, OkHttp).**

---

### 📜 Convention & Maintainable (Quy tắc và Khả năng bảo trì)

- **[ ] Ghi chú cho phương thức trống:** Nếu một phương thức được cố ý để trống, hãy thêm một comment giải thích lý do (`// Intentional empty method`).
- **[ ] Thêm private constructor cho lớp tiện ích:** Các lớp chỉ chứa phương thức `static` (utility classes) nên có một **private constructor** để ngăn việc khởi tạo đối tượng.
