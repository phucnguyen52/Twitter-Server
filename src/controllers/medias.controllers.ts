import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/message'
import mediasServices from '~/services/medias.services'
import fs from 'fs'
import mime from 'mime/lite'
export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasServices.uploadImage(req)
  return res.json({ message: USERS_MESSAGES.UPLOAD_SUCCESS, result: url })
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasServices.uploadVideo(req)
  return res.json({ message: USERS_MESSAGES.UPLOAD_SUCCESS, result: url })
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}

export const serveVideoStreamController = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.headers)
  const range = req.headers.range
  console.log(range)
  if (!range) {
    console.log(2)
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Yêu cầu gửi lên Range trong Header')
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name) //lấy đường dẫn video
  // 1MB = 10^6 bytes (Tính theo hệ 10,d dây là thứ cta thấy trên UI)
  // Còn nếu tính theo hệ nhị phân thì 1MB = 2^20 bytes(1024 * 1024)
  //Bây giờ tính dung lượng Video
  const videoSize = fs.statSync(videoPath).size
  //Dung lượng video cho mỗi phân đoạn stream
  const chunkSize = 10 ** 6 //1MB
  //Lấy giá trị byte bắt đầu từ Header range (ví dụ như bytes=1048576-)
  const start = Number(range.replace(/\D/g, ''))
  //Lấy giá trị byte kết thúc, vượt qua dung lượng video thì lấy giá trị videoSize
  const end = Math.min(start + chunkSize, videoSize - 1)

  //Dung lượng thực tế cho mỗi đoạn video Stream
  //Thường đây sẽ là checkSize, ngoại trừ đoạn cuối cùng
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*' //Dùng thư viện mime để lấy Định dạng video
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStreams = fs.createReadStream(videoPath, { start, end })
  videoStreams.pipe(res)
}
