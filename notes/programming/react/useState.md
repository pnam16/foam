# useState

## Giải thích cách useState trong React hoạt động bất đồng bộ.

- Việc cập nhật giá trị state không xảy ra ngay lập tức
- Nếu kiểm tra giá trị của `state` ngay sau khi `setState` sẽ biểu thị giá trị cũ
- Tại sao bất đồng bộ
  - React sử dụng cơ chế bất đồng bộ để tối ưu hóa hiệu suất.
    Thay vì cập nhật state ngay lập tức, React nhóm các thao tác cập nhật lại và thực hiện chúng trong một lần render duy nhất
  - Quá trình này được quản lý bởi `React Scheduler`
