import { config } from 'dotenv'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/User.requests'
config()
export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, function (error, token) {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SECRET as string
}: {
  token: string
  secretOrPublicKey?: string
}) => {
  // return new Promise<jwt.JwtPayload>((resolve, reject) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    //sử dụng TokenPayload bởi vì trong jwt.JwtPayload mặc định ko có user_id và token)type nên ta tạo interface kế thừa nó và thêm 2 thuộc tính đó vào
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as TokenPayload)
    })
  })
}
