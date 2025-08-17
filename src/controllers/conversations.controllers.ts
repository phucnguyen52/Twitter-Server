import { Request, Response } from 'express'
import { GetConversationsParams } from '~/models/requests/Conversations.request'
import conversationService from '~/services/conversations.services'
export const getConversationsController = async (req: Request<GetConversationsParams>, res: Response) => {
  const { receiver_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const sender_id = req.decoded_authorization?.user_id as string
  const result = await conversationService.getConversations({
    sender_id,
    receiver_id,
    limit,
    page
  })
  return res.json({
    message: 'Get conversations successfully',
    result: {
      conversations: result.conversations,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
