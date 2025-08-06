import { Router } from 'express'
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  oauthController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyEmailTokenValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handlers'
const userRouter = Router()
// Body: {email: string, password: string}
userRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

userRouter.get('/oauth/google', wrapRequestHandler(oauthController))
// Body: {name:string, email: string, password: string, confirm_password:string, date_of_birth: ISO8601}
userRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
// Header: {Authorization:Bearer <access_token>}
// Body: { refresh_token: string}
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
// Body: { email-verify-token: string}
userRouter.post('/verify-email', verifyEmailTokenValidator, wrapRequestHandler(verifyEmailController))
// Header: {Authorization: Bearer <access_token></access_token>}
//Body: {} resendVerifyEmailValidato: để kiểm tra xem tài khoản đã xác thực chưa nếu đã xác thực rồi thì không cho nhấn gửi lại email
userRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))
// Body: {email:string}
userRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

userRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)
//Body: {forgot_password_token: string, password: string, confirm_password: string}
userRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))
// Header: {Authorization:Bearer <access_token>}
userRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

userRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

userRouter.get('/:username', wrapRequestHandler(getProfileController))

// Header: {Authorization:Bearer <access_token>}
// Follow someone. Body: {follower_user_id: string}
userRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

userRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapRequestHandler(unfollowController)
)

userRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default userRouter
