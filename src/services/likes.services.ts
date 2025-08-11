import databaseService from './database.services'
import { ObjectId, WithId } from 'mongodb'
import Bookmark from '~/models/schemas/Bookmark.schema'

class LikeService {
  async likeTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.likes.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Bookmark({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return result
  }
  async unlikeTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    return result
  }
  async unlikeTweetByLikeId(user_id: string, like_id: string) {
    const result = await databaseService.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      _id: new ObjectId(like_id)
    })
    return result
  }
}
const likeService = new LikeService()
export default likeService
