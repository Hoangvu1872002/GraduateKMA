# Hệ thống Ứng dụng Vận chuyển

## 📌 Mô tả tổng quan
Hệ thống bao gồm các thành phần chính hỗ trợ quy trình vận chuyển hàng hóa giữa khách hàng và tài xế, với sự phối hợp giữa **App Khách Hàng**, **App Tài Xế**, **Server**, và **Cơ sở dữ liệu (Database)**.

## 🧩 Kiến trúc hệ thống

### 0. Mô hình kiến trúc hệ thống
![image](https://github.com/user-attachments/assets/02d7e614-031f-4d99-96d6-98211abe04d3)

### 1. App Khách Hàng
Ứng dụng dành cho người dùng có nhu cầu vận chuyển hàng hóa.
- 📦 Đặt đơn vận chuyển
- 🚚 Theo dõi quá trình vận chuyển
- 🕓 Quản lý lịch sử vận chuyển
- 💵 Quản lý chi tiêu
- 💳 Thanh toán đơn vận chuyển
- 📞 Liên hệ tài xế
- 📅 Quản lý danh sách sự kiện sắp diễn ra
- 💬 Đánh giá tài xế

### 2. App Tài Xế
Ứng dụng dành cho tài xế để nhận và thực hiện đơn hàng.
- ✅ Nhận đơn vận chuyển
- 📍 Quản lý trạng thái đơn vận chuyển
- 🕓 Quản lý lịch sử vận chuyển
- 🧭 Chỉ đường
- 💰 Quản lý thu nhập
- ➕ Nạp tiền vào ví
- ☎️ Liên hệ khách hàng

### 3. Server (Hệ thống vận chuyển)
Chịu trách nhiệm xử lý nghiệp vụ trung gian giữa 2 app và kết nối cơ sở dữ liệu.
- 👤 Xử lý tìm tài xế
- 📥 Xử lý nhận đơn từ tài xế
- 📡 Xử lý quá trình vận chuyển
- 🔄 Xử lý cập nhật trạng thái đơn hàng
- ❌ Xử lý hủy đơn
- 📦 Quản lý đơn vận chuyển
- 📅 Quản lý sự kiện từ phía khách hàng
- 💰 Xử lý thanh toán, nạp tiền
- 🔌 Quản lý API, sự kiện SocketIO (real-time)

### 4. Database
Lưu trữ toàn bộ dữ liệu hệ thống.
- 🧑‍✈️ Thông tin tài xế
- 👤 Thông tin tài khoản khách hàng
- 🚚 Thông tin vận chuyển
- 📅 Sự kiện phía khách hàng
- 💬 Ghi chú, phòng chat

## 🚀 Mục tiêu hệ thống
- 🎯 **Tối ưu hóa trải nghiệm người dùng**  
  Giao diện thân thiện, dễ sử dụng cho cả khách hàng và tài xế. Người dùng có thể đặt/nhận đơn nhanh chóng, theo dõi tiến trình vận chuyển và thao tác các chức năng như thanh toán, liên hệ, đánh giá… một cách mượt mà.
- 📦 **Vận hành đơn hàng chính xác, minh bạch**  
  Hệ thống theo dõi trạng thái đơn hàng theo thời gian thực, đảm bảo minh bạch từ lúc đặt đơn, vận chuyển đến khi hoàn tất. Cả khách hàng và tài xế đều có thể nắm rõ từng bước xử lý đơn hàng.
- 🔄 **Cập nhật dữ liệu real-time qua SocketIO**  
  Sử dụng SocketIO để truyền tải sự kiện tức thời như cập nhật trạng thái đơn, vị trí tài xế, thông báo... giúp hệ thống phản hồi nhanh, tăng tính tương tác và hiệu quả vận hành.

## 🚀 Demo
### 1. Một số giao diện app Khách Hàng
![image](https://github.com/user-attachments/assets/1bd6c700-03ac-4113-9b66-b02daec11235)
![image](https://github.com/user-attachments/assets/d53b7aa6-c15d-4533-9cab-f8230c20303d)

### 1. Một số giao diện app Tài Xế
![image](https://github.com/user-attachments/assets/b8fbd336-31cf-4f2a-80da-7d343da03687)




