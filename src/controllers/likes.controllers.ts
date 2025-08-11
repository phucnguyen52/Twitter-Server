import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { COMMENTS_MESSAGES } from '~/constants/message'
import { LikeTweetReqBody } from '~/models/requests/Like.request'
import { TokenPayload } from '~/models/requests/User.requests'
import likeService from '~/services/likes.services'

export const likeTweetController = async (req: Request<ParamsDictionary, any, LikeTweetReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeService.likeTweet(user_id, req.body.tweet_id)
  return res.json({
    message: COMMENTS_MESSAGES.LIKE_SUCCESS,
    result: result
  })
}
export const unlikeTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeService.unlikeTweet(user_id, req.params.tweet_id)
  return res.json({
    message: COMMENTS_MESSAGES.UNLIKE_SUCCESS,
    result: result
  })
}

export const unlikeTweetBylikeIdController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeService.unlikeTweetByLikeId(user_id, req.params.like_id)
  return res.json({
    message: COMMENTS_MESSAGES.UNLIKE_SUCCESS,
    result: result
  })
}
