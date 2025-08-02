# Long polling

Long polling là một kỹ thuật giúp giả lập realtime communication giữa client và server

## Cách hoạt động của Long Polling:

1. Client gửi request lên server để hỏi có dữ liệu mới không.
2. Nếu chưa có dữ liệu, server sẽ giữ kết nối mở (timeout có thể là 15–30 giây) thay vì trả về ngay.
3. Khi có dữ liệu mới, server trả response.
4. Client lập tức gửi request mới => vòng lặp tiếp tục.

## Khác với Polling thường

| Regular Polling                             | Long Polling                              |
| ------------------------------------------- | ----------------------------------------- |
| Gửi request liên tục định kỳ (ví dụ mỗi 5s) | Gửi 1 request → giữ mở đến khi có dữ liệu |
| Tốn tài nguyên, nhiều request dư thừa       | Giảm số request → tiết kiệm tài nguyên    |
| Độ trễ cố định                              | Độ trễ gần như tức thì                    |

## Khi nào dùng Long Polling

- Khi không thể dùng WebSocket (do firewall, legacy browsers, hoặc hạ tầng không hỗ trợ).
- Ứng dụng cần realtime đơn giản: chat, thông báo, cập nhật dữ liệu
- Server không thể push dữ liệu một cách chủ động

## Nhược điểm

- Tốn tài nguyên hơn WebSocket
