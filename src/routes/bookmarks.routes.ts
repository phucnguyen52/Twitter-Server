import { Router } from 'express'
import {
  bookmarkTweetController,
  unbookmarkTweetByBookmarkIdController,
  unbookmarkTweetController
} from '~/controllers/bookmarks.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const bookmarksRouter = Router()
// Bookmark Tweet
// Body: {tweet_id: string}
bookmarksRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(bookmarkTweetController))

// UnBookmark Tweet
// Path: '/:tweet_id'
bookmarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(unbookmarkTweetController)
)

bookmarksRouter.delete(
  '/:bookmark_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(unbookmarkTweetByBookmarkIdController)
)
export default bookmarksRouter
