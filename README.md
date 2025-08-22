# 🐦 Twitter Clone Backend

## 📌 Giới thiệu
Đây là **backend API** của dự án **Twitter Clone**, được xây dựng bằng **Node.js + Express.js**.  
Hệ thống cung cấp các API cần thiết để phục vụ frontend (Next.js hoặc React), bao gồm quản lý người dùng, tweet, bình luận, like, follow, nhắn tin realtime bằng socket.io, **streaming video dạng HLS (.m3u8)** và nhiều tính năng khác.  


## 🚀 Tính năng chính
- **Xác thực & Người dùng**
  - Đăng ký, đăng nhập, đăng xuất.
  - Xác thực bằng JWT + Refresh Token.
  - Đăng nhập với Google.
  - CRUD hồ sơ người dùng.
  - Follow & Unfollow.
  - Xác minh email, quên mật khẩu, đặt lại mật khẩu.

- **Tweet**
  - Tạo, sửa, xoá tweet.
  - Like, bookmark.
  - Hashtag & gắn thẻ.
  - Phân trang tweet.
  - Get tweet detail + comment + retweet + quote.

- **Media**
  - Upload ảnh và video.
  - Lưu trữ trên Amazon S3.
  - **Video Streaming**: hỗ trợ phát video với chuẩn **HLS (.m3u8)**, cho phép xem video mượt hơn, tối ưu băng thông và phù hợp nhiều thiết bị.

- **Realtime (Socket.io)**
  - Nhắn tin realtime.
  - Notification.

- **Khác**
  - Tìm kiếm theo nội dung, media, người dùng.
  - Middleware kiểm tra token & phân quyền.

## 🛠️ Công nghệ sử dụng
- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT + Refresh Token  
- **Realtime:** Socket.io  
- **Storage:** Amazon S3  
- **Streaming:** HLS (.m3u8) với `fluent-ffmpeg`  
