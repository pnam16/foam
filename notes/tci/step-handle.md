# Quy trình xử lý khi tạo đề xuất, cần tạo các bước duyệt

- Tạo giải trình (`process_instances.resources_type` = 4)
  - Tìm process (`Process`)
    - Tạo `process_instances`
  - Lấy các firstStep ở bảng `process_steps`
    - Tạo `process_step_instances`
  - Tạo `step_instances_notification` theo `process_steps`
    - Gửi thông báo tới tất cả người tương ứng `process_steps.approve_type`
    - Lưu người duyệt vào `approver_id`
