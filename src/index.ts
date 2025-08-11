import express from 'express'
import databaseService from '~/services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import userRouter from './routes/users.routes'
import mediasRouter from './routes/medias.routes'
import staticRouter from './routes/static.routes'
import cors from 'cors'
import tweetsRouter from './routes/tweets.routes'

config({ quiet: true })
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshToken()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
})
const app = express()
app.use(cors())
const port = process.env.PORT || 4000
initFolder()

app.use(express.json())
app.use('/users', userRouter)
app.use('/medias', mediasRouter)
app.use('/tweets', tweetsRouter)
app.use('/static', staticRouter)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Server đã chạy ở port ${port}`)
})
