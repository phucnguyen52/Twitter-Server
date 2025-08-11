import { Router } from 'express'
import {
  likeTweetController,
  unlikeTweetBylikeIdController,
  unlikeTweetController
} from '~/controllers/likes.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const likesRouter = Router()
likesRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(likeTweetController))

// UnBookmark Tweet
// Path: '/:tweet_id'
likesRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(unlikeTweetController)
)

likesRouter.delete(
  '/:like_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(unlikeTweetBylikeIdController)
)
export default likesRouter
