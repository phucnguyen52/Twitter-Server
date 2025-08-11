import { ObjectId } from 'mongodb'

export interface RefreshTokenType {
  _id?: ObjectId
  token: string
  created_at?: Date
  user_id: ObjectId
  iat: number
  exp: number
}

export default class RefreshToken {
  _id?: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId
  iat: Date
  exp: Date
  constructor({ _id, token, created_at, user_id, iat, exp }: RefreshTokenType) {
    this._id = _id
    this.token = token
    this.created_at = created_at || new Date()
    this.user_id = user_id
    // this.iat = typeof iat === 'number' ? new Date(iat * 1000) : new Date(iat)
    // this.exp = typeof exp === 'number' ? new Date(exp * 1000) : new Date(exp)

    this.iat = new Date(iat * 1000)
    this.exp = new Date(exp * 1000) //convert sang Epoch time to Date
  }
}
