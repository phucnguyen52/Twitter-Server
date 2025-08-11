import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { COMMENTS_MESSAGES } from '~/constants/message'
import { BookmarkTweetReqBody } from '~/models/requests/Bookmark.request'
import { TokenPayload } from '~/models/requests/User.requests'
import bookmarkService from '~/services/bookmarks.services'
export const bookmarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.bookmarkTweet(user_id, req.body.tweet_id)
  return res.json({
    message: COMMENTS_MESSAGES.BOOKMARK_SUCCESS,
    result: result
  })
}
export const unbookmarkTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.unbookmarkTweet(user_id, req.params.tweet_id)
  return res.json({
    message: COMMENTS_MESSAGES.UNBOOKMARK_SUCCESS,
    result: result
  })
}

export const unbookmarkTweetByBookmarkIdController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.unbookmarkTweetByBookmarkId(user_id, req.params.bookmark_id)
  return res.json({
    message: COMMENTS_MESSAGES.UNBOOKMARK_SUCCESS,
    result: result
  })
}
