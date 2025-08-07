# useState

## Giải thích cách useState trong React hoạt động bất đồng bộ.

- Việc cập nhật giá trị state không xảy ra ngay lập tức
- Nếu kiểm tra giá trị của `state` ngay sau khi `setState` sẽ biểu thị giá trị cũ
- Tại sao bất đồng bộ
  - React sử dụng cơ chế bất đồng bộ để tối ưu hóa hiệu suất.
    Thay vì cập nhật state ngay lập tức, React nhóm các thao tác cập nhật lại và thực hiện chúng trong một lần render duy nhất
  - Quá trình này được quản lý bởi `React Scheduler`
- Hậu quả của tính bất đồng bộ
  - Gọi nhiều setState liên tiếp trong cùng một hàm, React sẽ gộp chúng lại và chỉ render một lần với giá trị cuối cùng.
  - Đảm bảo tính toán chính xác, hãy sử dụng functional update:
  ```js
  const handleClick = () => {
    setCount(count + 1); // count = 0
    setCount(count + 2); // count = 0
    setCount(count + 3); // count = 0
    // Chỉ render một lần với count = 3 (nếu dùng count trực tiếp)
  };
  ```
  ```js
  const handleClick = () => {
    setCount((prev) => prev + 1); // prev = 0 -> 1
    setCount((prev) => prev + 2); // prev = 1 -> 3
    setCount((prev) => prev + 3); // prev = 3 -> 6
    // Kết quả cuối cùng: count = 6
  };
  ```

#Interview
