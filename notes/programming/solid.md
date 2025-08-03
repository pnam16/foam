# SOLID

SOLID là viết tắt của năm nguyên tắc thiết kế hướng đối tượng, được Robert C. Martin (Uncle Bob) giới thiệu để tạo ra mã dễ đọc, dễ bảo trì, và dễ mở rộng. Các nguyên tắc này đặc biệt quan trọng trong các dự án lớn, như ứng dụng tài chính, nơi yêu cầu tính ổn định và khả năng mở rộng.
SOLID bao gồm:

S - Single Responsibility Principle (Nguyên tắc trách nhiệm đơn nhất)
O - Open/Closed Principle (Nguyên tắc mở/đóng)
L - Liskov Substitution Principle (Nguyên tắc thay thế Liskov)
I - Interface Segregation Principle (Nguyên tắc phân tách giao diện)
D - Dependency Inversion Principle (Nguyên tắc đảo ngược phụ thuộc)

## Chi tiết từng nguyên tắc

### S

- 1 class chỉ chịu 1 trách nhiệm, 1 chức năng duy nhất

### O

- Có thể thoải mái mở rộng 1 class, nhưng không được sửa đổi bên trong class đó
  (open for extension but closed for modification).
- 1 class chỉ chịu 1 trách nhiệm, 1 chức năng duy nhất

### L

- Các object của class con có thể thay thế class cha mà không làm thay đổi tính đúng đắn của chương trình

### I

- Thay vì dùng 1 interface lớn, ta nên tách thành nhiều interface nhỏ, với nhiều mục đích cụ thể

### D

- 1 class chỉ chịu 1 trách nhiệm, 1 chức năng duy nhất
