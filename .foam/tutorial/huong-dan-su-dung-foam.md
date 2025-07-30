# Hướng dẫn sử dụng Foam chi tiết

## Giới thiệu về Foam

Foam là một hệ thống ghi chú mạnh mẽ được xây dựng trên nền tảng Visual Studio Code. Nó cho phép bạn tạo ra một cơ sở kiến thức cá nhân với khả năng liên kết các ghi chú với nhau một cách thông minh.

### Đặc điểm chính của Foam:

- **Wikilinks**: Liên kết các ghi chú với nhau
- **Backlinking**: Tự động tạo liên kết ngược
- **Graph Visualization**: Hiển thị mối quan hệ giữa các ghi chú
- **Tags**: Phân loại và tổ chức nội dung
- **Daily Notes**: Ghi chú hàng ngày
- **Templates**: Mẫu ghi chú có sẵn

## Cài đặt và Thiết lập

### Yêu cầu hệ thống:

- Visual Studio Code
- Tài khoản GitHub (tùy chọn)
- Hệ điều hành: Windows, macOS, hoặc Linux

### Bước 1: Tạo workspace Foam

1. Truy cập [foam-template](https://github.com/foambubble/foam-template/generate)
2. Nhấn "Use this template" để fork về tài khoản GitHub của bạn
3. Clone repository về máy local
4. Mở thư mục trong VS Code

### Bước 2: Cài đặt Extensions

Khi mở workspace lần đầu, VS Code sẽ đề xuất cài đặt các extensions cần thiết:

- **Foam**: Extension chính
- **Markdown All In One**: Hỗ trợ Markdown
- **vscode-paste-image**: Dán ảnh từ clipboard

Nhấn "Install all" để cài đặt tất cả.

## Các tính năng cơ bản

### 1. Tạo ghi chú mới

- Sử dụng `Ctrl+N` để tạo file mới
- Lưu với đuôi `.md`
- Hoặc sử dụng wikilink `[[tên ghi chú]]` để tạo ghi chú mới

### 2. Wikilinks - Liên kết ghi chú

Wikilinks là cách chính để liên kết các ghi chú với nhau:

```markdown
[[tên ghi chú]] - Liên kết đến ghi chú khác
[[tên ghi chú|hiển thị khác]] - Liên kết với tên hiển thị khác
```

**Cách sử dụng:**

- Gõ `[[` để bắt đầu wikilink
- VS Code sẽ gợi ý các ghi chú có sẵn
- `Ctrl+Click` (Windows) hoặc `Cmd+Click` (Mac) để mở ghi chú
- `Ctrl+-` để quay lại ghi chú trước

### 3. Backlinking - Liên kết ngược

Foam tự động tạo liên kết ngược. Khi bạn liên kết đến một ghi chú, ghi chú đó sẽ hiển thị danh sách các ghi chú đã liên kết đến nó.

### 4. Tags - Thẻ phân loại

Sử dụng tags để phân loại nội dung:

```markdown
#tag - Tag đơn giản
#tag/subtag - Tag phân cấp
```

**Cách sử dụng:**

- Gõ `#` để bắt đầu tag
- Sử dụng Tag Explorer trong sidebar để xem tất cả tags
- Click vào tag để xem tất cả ghi chú có tag đó

### 5. Graph Visualization

Xem mối quan hệ giữa các ghi chú:

1. Mở Command Palette (`Ctrl+Shift+P`)
2. Gõ "Foam: Show Graph"
3. Xem biểu đồ mối quan hệ giữa các ghi chú

### 6. Daily Notes - Ghi chú hàng ngày

Tạo ghi chú tự động cho từng ngày:

1. Mở Command Palette (`Ctrl+Shift+P`)
2. Gõ "Foam: Open Daily Note"
3. Ghi chú sẽ được tạo trong thư mục `journal`

## Các tính năng nâng cao

### 1. Note Templates - Mẫu ghi chú

Tạo mẫu cho các loại ghi chú khác nhau:

- Book reviews
- Meeting notes
- Project documentation
- Daily notes

### 2. Including Notes - Nhúng ghi chú

Nhúng nội dung từ ghi chú khác:

```markdown
![[tên ghi chú]] - Nhúng toàn bộ ghi chú
![[tên ghi chú#section]] - Nhúng một phần cụ thể
```

### 3. Paste Images - Dán ảnh

- Copy ảnh vào clipboard
- Nhấn `Ctrl+Alt+V` (Windows) hoặc `Cmd+Alt+V` (Mac)
- Ảnh sẽ được lưu và liên kết tự động

### 4. Spell Checking - Kiểm tra chính tả

Foam hỗ trợ kiểm tra chính tả thông qua VS Code:

- Cài đặt extension spell checker
- Lỗi chính tả sẽ được gạch chân đỏ
- Click chuột phải để sửa lỗi

### 5. Custom Snippets - Đoạn mã tùy chỉnh

Tạo các đoạn mã tái sử dụng:

1. Mở Command Palette
2. Gõ "Preferences: Configure User Snippets"
3. Chọn "markdown.json"
4. Thêm snippets tùy chỉnh

## Tổ chức workspace

### Cấu trúc thư mục đề xuất:

```
foam/
├── inbox.md          # Ghi chú tạm thời
├── daily-notes/      # Ghi chú hàng ngày
├── projects/         # Dự án
├── references/       # Tài liệu tham khảo
├── templates/        # Mẫu ghi chú
└── attachments/      # File đính kèm
```

### Quy tắc đặt tên:

- Sử dụng kebab-case: `ten-ghi-chu.md`
- Tên file ngắn gọn, mô tả rõ nội dung
- Tránh ký tự đặc biệt

## Đồng bộ và Backup

### Sử dụng Git:

1. Khởi tạo Git repository
2. Commit thường xuyên
3. Push lên GitHub/GitLab
4. Sử dụng GitHub Actions để tự động sync

### Các lệnh Git cơ bản:

```bash
git add .
git commit -m "Cập nhật ghi chú"
git push origin main
```

## Phím tắt hữu ích

### Phím tắt VS Code:

- `Ctrl+N`: Tạo file mới
- `Ctrl+S`: Lưu file
- `Ctrl+Shift+P`: Mở Command Palette
- `Ctrl+Click`: Mở wikilink
- `Ctrl+-`: Quay lại
- `Ctrl+Shift+F`: Tìm kiếm toàn bộ workspace

### Phím tắt Foam:~~~~

- `Ctrl+Alt+V`: Dán ảnh
- `Ctrl+Shift+P` + "Foam: Open Daily Note": Mở ghi chú hàng ngày
- `Ctrl+Shift+P` + "Foam: Show Graph": Hiển thị biểu đồ

## Mẹo sử dụng hiệu quả

### 1. Bắt đầu với Inbox

- Sử dụng `inbox.md` để ghi chú nhanh
- Phân loại và di chuyển ghi chú sau

### 2. Sử dụng Tags có hệ thống

- Tạo hệ thống tag nhất quán
- Sử dụng tag phân cấp: `#project/website`, `#project/mobile`

### 3. Tạo Templates

- Tạo mẫu cho các loại ghi chú thường dùng
- Tiết kiệm thời gian và đảm bảo tính nhất quán

### 4. Review định kỳ

- Xem lại ghi chú cũ
- Cập nhật liên kết
- Dọn dẹp ghi chú không cần thiết

### 5. Sử dụng Graph để khám phá

- Xem biểu đồ để hiểu mối quan hệ
- Tìm ghi chú liên quan
- Phát hiện chủ đề chưa được liên kết

## Xử lý sự cố thường gặp

### 1. Wikilink không hoạt động

- Kiểm tra tên file chính xác
- Đảm bảo file có đuôi `.md`
- Restart VS Code

### 2. Graph không hiển thị

- Kiểm tra extension Foam đã được cài đặt
- Đảm bảo có ít nhất 2 ghi chú có liên kết
- Thử lệnh "Foam: Refresh Graph"

### 3. Extensions không hoạt động

- Kiểm tra VS Code version
- Reinstall extensions
- Kiểm tra workspace settings

## Tài nguyên học tập

### Tài liệu chính thức:

- [Foam Documentation](https://foambubble.github.io/foam)
- [Foam Recipes](https://foambubble.github.io/foam/user/recipes/recipes)

### Cộng đồng:

- [Foam Discord](https://foambubble.github.io/join-discord/g)
- [GitHub Issues](https://github.com/foambubble/foam/issues)

### Video hướng dẫn:

- YouTube tutorials
- Community workshops

## Kết luận

Foam là một công cụ mạnh mẽ để xây dựng cơ sở kiến thức cá nhân. Với các tính năng như wikilinks, backlinking, và graph visualization, bạn có thể tạo ra một hệ thống ghi chú thông minh và hiệu quả.

Bắt đầu với những tính năng cơ bản, sau đó dần dần khám phá các tính năng nâng cao. Quan trọng nhất là xây dựng thói quen ghi chú thường xuyên và tổ chức nội dung một cách có hệ thống.

Chúc bạn thành công với Foam!
