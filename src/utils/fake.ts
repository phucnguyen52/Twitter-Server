import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enum'
import { TweetRequestBody } from '~/models/requests/Tweet.requests'
import { RegisterReqBody } from '~/models/requests/User.requests'
import Follower from '~/models/schemas/Follower.schema'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import tweetsService from '~/services/tweets.services'
import { hashPassword } from '~/utils/crypto'

// Mật khẩu cho các fake user
const PASSWORD = 'Phucbay5223@'

// ID của tài khoản của mình, dùng để follow người khác
const MYID = new ObjectId('689c07293ed1d2f7594d8bfd')

// Số lượng user được tạo, mỗi user sẽ mặc định tweet 2 cái
const USER_COUNT = 100

const createRandomUser = () => {
  const user: RegisterReqBody = {
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    password: PASSWORD,
    confirm_password: PASSWORD,
    date_of_birth: faker.date.past().toISOString()
  }
  return user
}

const createRandomTweet = () => {
  const tweet: TweetRequestBody = {
    type: TweetType.Tweet,
    audience: TweetAudience.Everyone,
    content: faker.lorem.paragraph({
      min: 10,
      max: 160
    }),
    hashtags: [],
    medias: [],
    mentions: [],
    parent_id: null
  }
  return tweet
}

const users: RegisterReqBody[] = faker.helpers.multiple(createRandomUser, {
  count: USER_COUNT
})

const insertMultipleUsers = async (users: RegisterReqBody[]) => {
  const result = await Promise.all(
    users.map(async (user) => {
      // ID giả chỉ để làm username
      const fakeIdForUsername = new ObjectId()

      // Insert user vào DB, để MongoDB tự sinh _id
      const inserted = await databaseService.users.insertOne(
        new User({
          ...user,
          username: `user${fakeIdForUsername.toString()}`, // chỉ dùng cho username
          password: hashPassword(user.password),
          date_of_birth: new Date(user.date_of_birth),
          verify: UserVerifyStatus.Verified
        })
      )

      // Trả về _id thật của MongoDB
      return inserted.insertedId
    })
  )

  console.log(`Created ${result.length} users`)
  return result
}

const followMultipleUsers = async (user_id: ObjectId, followed_user_ids: ObjectId[]) => {
  // console.log('okk', followed_user_ids)
  // console.log('Start following ...')
  const result = await Promise.all(
    followed_user_ids.map((followed_user_id) =>
      databaseService.followers.insertOne(
        new Follower({
          user_id,
          follower_user_id: new ObjectId(followed_user_id)
        })
      )
    )
  )
  // console.log(`Followed ${result.length} users`)
}

const insertMultipleTweets = async (ids: ObjectId[]) => {
  // console.log('Creating tweets ...')
  // console.log('Counting ...')
  let count = 0
  const result = await Promise.all(
    ids.map(async (id, index) => {
      await Promise.all([
        tweetsService.createTweet(id.toString(), createRandomTweet()),
        tweetsService.createTweet(id.toString(), createRandomTweet())
      ])
      count += 2
      // console.log(`Created ${count} tweets`)
    })
  )
  return result
}

insertMultipleUsers(users).then((ids) => {
  // console.log(users)
  // console.log(ids)
  followMultipleUsers(new ObjectId(MYID), ids)
  insertMultipleTweets(ids)
})
