import fsPromise from 'fs/promises'
import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import mime from 'mime'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { getFiles, getNameFromFullname, handleUploadImage, handleUploadVideo } from '~/utils/file'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
import { EncodingStatus, MediaType } from '~/constants/enum'
import { Media } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
import { uploadFileToS3 } from '~/utils/s3'
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
    // item = /home/duy/Downloads/12312312/1231231221.mp4
    const idName = getNameFromFullname(item.split('\\').pop() as string)
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

      // Lấy tên file gốc (không cần split thủ công)
      const baseName = path.basename(videoPath) // Ví dụ: "UjAy8rriKEplMhnC0XHq_"
      const idName = getNameFromFullname(baseName)

      await databaseService.videoStatus.updateOne(
        { name: idName },
        {
          $set: { status: EncodingStatus.Procesing },
          $currentDate: { updated_at: true }
        }
      )

      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift() // Xoá phần tử đầu
        const fullFolderPath = path.resolve(UPLOAD_VIDEO_DIR, idName)
        const files = getFiles(fullFolderPath)
        await Promise.all(
          files.map((filepath) => {
            const relativePath = path.relative(UPLOAD_VIDEO_DIR, filepath) // chuẩn hóa dấu \
            const filename = path.join('videos-hls', relativePath).replace(/\\/g, '/')
            return uploadFileToS3({
              filepath,
              filename,
              contentType: mime.getType(filepath) as string
            })
          })
        )
        await Promise.all([
          fsPromise.unlink(videoPath),
          fsPromise.rm(path.resolve(UPLOAD_VIDEO_DIR, idName), { recursive: true, force: true })
        ])

        await databaseService.videoStatus.updateOne(
          { name: idName },
          {
            $set: { status: EncodingStatus.Success },
            $currentDate: { updated_at: true }
          }
        )

        console.log(`Encode video ${videoPath} success`)
      } catch (error) {
        await databaseService.videoStatus
          .updateOne(
            { name: idName },
            {
              $set: { status: EncodingStatus.Failed },
              $currentDate: { updated_at: true }
            }
          )
          .catch((err) => {
            console.log('Update video status error', err)
          })
        console.error(`Encode video ${videoPath} error`, error)
      }

      this.encoding = false
      this.processEncode()
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
        const newFullFileName = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const s3Result = await uploadFileToS3({
          filename: 'images/' + newFullFileName,
          filepath: newPath,
          contentType: mime.getType(newPath) as string
        })
        await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])
        // return {
        //   url: isProduction
        //     ? `${process.env.HOST}/static/image/${newFullFileName}`
        //     : `http://localhost:${process.env.PORT}/static/image/${newFullFileName}`,
        //   type: MediaType.Image
        // }
        return {
          url: s3Result.Location as string,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const s3Result = await uploadFileToS3({
          filename: 'videos/' + file.newFilename,
          filepath: file.filepath,
          contentType: mime.getType(file.filepath) as string
        })
        return {
          url: s3Result.Location as string,
          type: MediaType.Video
        }
        // return {
        //   url: isProduction
        //     ? `${process.env.HOST}/static/video/${file.newFilename}`
        //     : `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`,
        //   type: MediaType.Video
        // }
      })
    )
    return result
  }
  async uploadVideoHLS(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        queue.enqueue(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/video-hls/${newName}/master.m3u8`
            : `http://localhost:${process.env.PORT}/static/video-hls/${newName}/master.m3u8`,
          type: MediaType.HLS
        }
      })
    )
    return result
  }
  async getVideoHLSStatus(id: string) {
    const data = await databaseService.videoStatus.findOne({ name: id })
    return data
  }
}
const mediasServices = new MediasServices()
export default mediasServices
