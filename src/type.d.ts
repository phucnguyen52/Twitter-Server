import { Request } from 'express'
import User from './models/schemas/User.schema'
import { TokenPayload } from './models/requests/User.requests'
// mở rộng định nghĩa module sẵn có (ở đây là express) để thêm loại (type) mới mà bạn cần. (thêm kiểu dữ liệu)
declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload //
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
  }
}
