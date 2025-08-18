import { Request } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { verifyToken } from './jwt'
import { JsonWebTokenError } from 'jsonwebtoken'

//chuyển từ enum trả về dạng mảng giá trị number
export const numberEnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}

export const verifyAccessToken = async (access_token: string, req?: Request) => {
  if (!access_token) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }

  try {
    const decoded_authorization = await verifyToken({
      token: access_token,
      secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    }) //để xác thực JWT.
    if (req) {
      ;(req as Request).decoded_authorization = decoded_authorization //Gắn thông tin người dùng (đã decode từ JWT) vào req, Để các middleware khác hoặc controller có thể dùng tiếp:
      return true
    }
    return decoded_authorization
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      //Xử lý khi token không hợp lệ về mặt kỹ thuật:Sai chữ ký.Bị chỉnh sửa.Không decode được.Định dạng không đúng.Không phải JWT thật sự.
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
  }
}
