import express from 'express'
import userRouter from './routes/users.router'
import databaseService from '~/services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
databaseService.connect()
const app = express()
const port = 4000
app.use(express.json())
app.use('/users', userRouter)
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Server đã chạy ở port ${port}`)
})
