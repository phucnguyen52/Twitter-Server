import express from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

// lấy từ https://express-validator.github.io/docs/guides/manually-running
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    // không có lỗi thì next()
    if (errors.isEmpty()) {
      return next()
    }
    const errorsObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      // lỗi status không phải 422
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
        // để đưa lỗi sang error handler ở file index.ts
      }
      // lỗi 422(validation)
      entityError.errors[key] = errorsObject[key]
    }

    next(entityError)
  }
}
