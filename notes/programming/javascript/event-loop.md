# Event loop

## Event Loop’s Microtask Queue

- Bao gồm:
  - Promise.then(), Promise.catch(), Promise.finally()
  - queueMicrotask()
- Đặc điểm:
  - **Ưu tiên cao nhất** sau mỗi vòng lặp của Event Loop
  - Chạy ngay sau khi Call Stack rỗng
  - Chạy toàn bộ microtasks trong hàng đợi trước khi chuyển sang macrotask
- Ví dụ:

```javascript
console.log("A");

Promise.resolve().then(() => {
  console.log("B");
});

console.log("C");
```

Kết quả:

```
A
C
B
```

## Event Loop’s Macrotask Queue

- Bao gồm:
  - setTimeout(), setInterval()
  - setImmediate() (Node.js)
  - I/O tasks, UI rendering
- Đặc điểm:
  - Mỗi macrotask được đưa vào hàng đợi.
  - Microtask chạy trước, Macrotask chạy sau
  - Sau khi call stack rỗng, event loop kiểm tra và xử lý toàn bộ microtask trước, rồi mới lấy 1 macrotask để chạy.

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");
```

Kết quả:

```
A
D
C   ← microtask
B   ← macrotask
```
