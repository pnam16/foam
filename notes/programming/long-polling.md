# Long polling

Long polling là một kỹ thuật giúp giả lập realtime communication giữa client và server

## Cách hoạt động của Long Polling:

1. Client gửi request lên server để hỏi có dữ liệu mới không.
2. Nếu chưa có dữ liệu, server sẽ giữ kết nối mở (timeout có thể là 15–30 giây) thay vì trả về ngay.
3. Khi có dữ liệu mới, server trả response.
4. Client lập tức gửi request mới => vòng lặp tiếp tục.
