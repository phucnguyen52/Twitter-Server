import { Router } from 'express'
import { serveImageController, serveVideoController } from '~/controllers/medias.controllers'
//1 cách khác static file dể serving image và video
const staticRouter = Router()
staticRouter.get('/image/:name', serveImageController)
staticRouter.get('/video/:name', serveVideoController)
export default staticRouter
