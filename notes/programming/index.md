# PHẦN 1: LÝ THUYẾT CỐT LÕI (30–45 phút)

## Scope, Hoisting, Closure

- **Scope**: Có 3 loại chính: Global, Function, Block.
- **Hoisting**:
  - Biến (`var`, `let`, `const`) và hàm (declaration vs expression) được "kéo lên" đầu phạm vi.
  - `var` được hoisted toàn bộ function scope, còn `let` và `const` chỉ có block scope và không hoisted như `var`.
- **Closure**: Hàm có thể "nhớ" và truy cập các biến ở phạm vi nơi nó được khai báo, kể cả khi phạm vi đó đã kết thúc.

## 🔹 Var vs Let vs Const

- `var`: Hoisted toàn function, không có block scope.
- `let` & `const`: Có block scope, không hoisted như `var`.
- `const`: Không thể gán lại giá trị sau khi khai báo.

## 🔹 Event Loop, Callback Queue, Microtasks

- **Stack**: Nơi thực thi các hàm đồng bộ.
- **Web APIs**: Xử lý các tác vụ bất đồng bộ (setTimeout, fetch, v.v.).
- **Callback Queue**: Chứa các callback chờ được thực thi sau stack.
- **Microtask Queue**: Ưu tiên cao hơn callback queue (chủ yếu là Promise).
- **Cách JS xử lý bất đồng bộ**: Stack trống thì lấy task từ microtask queue trước, rồi đến callback queue.

## 🔹 Async/Await, Promises

- Giúp viết code bất đồng bộ dễ đọc, tuần tự hơn.
- Dùng `try/catch` để xử lý lỗi trong async/await.
- Có thể chuyển từ callback → Promise → async/await để code rõ ràng hơn.

## 🔹 Optional chaining (?.) & Nullish coalescing (??)

- **Optional chaining (`?.`)**: Tránh lỗi khi truy cập thuộc tính sâu của object không tồn tại.
- **Nullish coalescing (`??`)**: Chỉ fallback khi giá trị là `null` hoặc `undefined` (khác với `||`).

## 🔹 Immutability (Tư duy bất biến)

- Tránh thay đổi trực tiếp dữ liệu gốc.
- Sử dụng các phương pháp như spread (`...`), `map`, `filter`, `reduce` để tạo dữ liệu mới thay vì sửa đổi dữ liệu cũ.
