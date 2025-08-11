import { Router } from 'express'
import {
  uploadImageController,
  uploadVideoHLSController,
  videoHLSStatusController
} from '~/controllers/medias.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const mediasRouter = Router()

mediasRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadImageController)
)

// mediasRouter.post(
//   '/upload-video',
//   accessTokenValidator,
//   verifiedUserValidator,
//   wrapRequestHandler(uploadVideoController)
// )

mediasRouter.post(
  '/upload-video-hls',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoHLSController)
)

mediasRouter.get(
  '/video-hls-status/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(videoHLSStatusController)
)
export default mediasRouter
