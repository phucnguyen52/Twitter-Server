export enum UserVerifyStatus {
  Unverified, //chưa xác thực
  Verified, //đã xác thực
  Banned //bị khóa
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}
export enum MediaType {
  Image,
  Video
}
