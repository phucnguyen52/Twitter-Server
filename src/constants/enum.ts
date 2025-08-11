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
  Video,
  HLS
}

export enum EncodingStatus {
  Pending, // đang chờ ở hàng đợi(chưa được encode)
  Procesing, // Đang encode
  Success, // Encode thành công
  Failed // Encode thất bại
}

export enum TweetType {
  Tweet,
  Retweet,
  Comment,
  QuoteTweet
}

export enum TweetAudience {
  Everyone,
  TwitterCircle
}
