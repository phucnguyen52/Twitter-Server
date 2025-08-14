import { checkSchema } from 'express-validator'
import { MediaTypeQuery, PeopleFollow } from '~/constants/enum'
import { SEARCH_MESSAGES } from '~/constants/message'
import { validate } from '~/utils/validation'

export const searchValidator = validate(
  checkSchema(
    {
      content: {
        isString: {
          errorMessage: SEARCH_MESSAGES.CONTENT_MUSE_BE_STRING
        }
      },
      media_type: {
        optional: true,
        isIn: {
          options: [Object.values(MediaTypeQuery)]
        },
        errorMessage: SEARCH_MESSAGES.MEDIA_ERROR
      },
      people_follow: {
        optional: true,
        isIn: {
          options: [Object.values(PeopleFollow)]
        },
        errorMessage: SEARCH_MESSAGES.PEOPLE_FOLLOW_SUCCESS
      }
    },
    ['query']
  )
)
