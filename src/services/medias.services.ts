import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { getNameFromFullname, handleUploadImage, handleUploadVideo } from '~/utils/file'
import fs from 'fs'
import fsPromise from 'fs/promises'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
import { EncodingStatus, MediaType } from '~/constants/enum'
import { Media } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
config({ quiet: true })

class Queue {
  items: string[]
  encoding: boolean

  constructor() {
    this.items = []
    this.encoding = false
  }
  async enqueue(item: string) {
    this.items.push(item)
    console.log('item', item)
    // item = /home/duy/Downloads/12312312/1231231221.mp4
    const idName = getNameFromFullname(item.split('\\').pop() as string)
    console.log('@', idName)
    await databaseService.videoStatus.insertOne(
      new VideoStatus({
        name: idName,
        status: EncodingStatus.Pending
      })
    )
    this.processEncode() // Tự động xử lý khi có item mới
  }
  async processEncode() {
    if (this.encoding) return
    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
      const idName = getNameFromFullname(videoPath.split('/').pop() as string)
      await databaseService.videoStatus.updateOne(
        { name: idName },
        {
          $set: {
            status: EncodingStatus.Procesing
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift() // Xoá phần tử đầu
        await fs.promises.unlink(videoPath) // Xoá file sau khi encode xong
        await databaseService.videoStatus.updateOne(
          { name: idName },
          {
            $set: {
              status: EncodingStatus.Success
            },
            $currentDate: {
              updated_at: true
            }
          }
        )
        console.log(`Encode video ${videoPath} success`)
      } catch (error) {
        await databaseService.videoStatus
          .updateOne(
            { name: idName },
            {
              $set: {
                status: EncodingStatus.Failed
              },
              $currentDate: {
                updated_at: true
              }
            }
          )
          .catch((err) => {
            console.log('Update video status error', err)
          })
        console.error(`Encode video ${videoPath} error`)
        console.error(error)
      }
      this.encoding = false
      this.processEncode() // Gọi đệ quy xử lý tiếp nếu còn item
    } else {
      console.log('Encode video queue is empty')
    }
  }
}
const queue = new Queue()
class MediasServices {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  // async uploadVideo(req: Request) {
  //   const files = await handleUploadVideo(req)
  //   const result: Media[] = files.map((file) => {
  //     return {
  //       url: isProduction
  //         ? `${process.env.HOST}/static/video/${file.newFilename}`
  //         : `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`,
  //       type: MediaType.Video
  //     }
  //   })
  //   return result
  // }
  async uploadVideoHLS(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        queue.enqueue(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/video-hls/${newName}.m3u8`
            : `http://localhost:${process.env.PORT}/static/video-hls/${newName}.m3u8`,
          type: MediaType.HLS
        }
      })
    )
    return result
  }
  async getVideoHLSStatus(id: string) {
    console.log(id)
    const data = await databaseService.videoStatus.findOne({ name: id })
    return data
  }
}
const mediasServices = new MediasServices()
export default mediasServices
