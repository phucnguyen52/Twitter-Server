import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { searchValidator } from '~/middlewares/search.middlewares'
import { accessTokenValidator, isUserLoggedInValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const searchRouter = Router()

searchRouter.get('/', accessTokenValidator, verifiedUserValidator, searchValidator, searchController)

export default searchRouter
