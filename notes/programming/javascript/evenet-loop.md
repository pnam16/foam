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
