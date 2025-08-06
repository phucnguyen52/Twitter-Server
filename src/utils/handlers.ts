import { ParamsDictionary } from 'express-serve-static-core'
// import express, { NextFunction, Request, RequestHandler, Response } from 'express'
// export const wrapRequestHandler = (func: RequestHandler) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await func(req, res, next)
//     } catch (error) {
//       next(error)
//     }
//   }
// }

import express, { NextFunction, Request, RequestHandler, Response } from 'express'
import { ParsedQs } from 'qs'
export const wrapRequestHandler = <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>(
  func: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) => any
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return async (req, res, next) => {
    try {
      const result = await func(req, res, next)
      return result
    } catch (error) {
      next(error)
    }
  }
}
