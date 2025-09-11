# RabbitMQ

1. Cơ bản

- RabbitMQ đóng vai trò trung gian, nhận message từ producer và phân phối đến consumer.
- RabbitMQ triển khai theo AMQP (Advanced Message Queuing Protocol).

2. Các thành phần chính

- Producer: Ứng dụng gửi message.
- Consumer: Ứng dụng nhận message.
- Queue: Nơi lưu trữ message cho đến khi được consumer xử lý.
- Exchange
  - Nhận message từ producer sau đó định tuyến (routing) tới 1 hoặc nhiều queue
  - Direct Exchange:
    - Exchange sẽ so khớp routing key của message với binding key của queue, rồi gửi message
  - Fanout Exchange:
    - Gửi broadcast - tất cả queue bind vào exchange đều nhận message
  - Topic Exchange
    - Cho phép sử dụng pattern trong routing key
  - Headers Exchange
    - Không quan tâm routing key
    - Routing dựa trên cặp key-value trong header của message
    - Ví dụ: header {format: "pdf", type: "report"}, queue bind với {format=pdf, type=report} → match
