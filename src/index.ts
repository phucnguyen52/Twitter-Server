import express from 'express'
import databaseService from '~/services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_IMAGE_DIR } from './constants/dir'
import userRouter from './routes/users.routes'
import mediasRouter from './routes/medias.routes'
import staticRouter from './routes/static.routes'
config({ quiet: true })
databaseService.connect()
const app = express()
const port = process.env.PORT || 4000
initFolder()

app.use(express.json())
app.use('/users', userRouter)
app.use('/medias', mediasRouter)
// app.use('/static', express.static(UPLOAD_IMAGE_DIR))
app.use('/static', staticRouter)
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Server đã chạy ở port ${port}`)
})
