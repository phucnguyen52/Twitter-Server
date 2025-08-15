import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
config({ quiet: true })
// Create SES service object.
const sesClient = new SESClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})
const verifyEmailTemplate = fs.readFileSync(path.resolve('src/templates/verify-email.html'), 'utf-8')
const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}: {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  body: string
  subject: string
  replyToAddresses?: string | string[]
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

export const sendVerifyEmail = async (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: process.env.SES_FROM_ADDRESS as string,
    toAddresses: toAddress,
    body,
    subject
  })
  return sesClient.send(sendEmailCommand)
}

export const sendVerifyRegisterEmail = (
  toAddress: string,
  email_verify_token: string,
  template: string = verifyEmailTemplate
) => {
  const link = `${process.env.CLIENT_URL}/verify-email?token=${email_verify_token}`

  const filledTemplate = template
    .replace('{{title}}', 'Vui lòng xác minh email của bạn')
    .replace('{{content}}', 'Nhấn vào nút để xác minh email của bạn')
    .replace('{{titleLink}}', 'Xác minh')
    .replace('{{link}}', link)

  return sendVerifyEmail(toAddress, 'Xác minh email của bạn', filledTemplate)
}

export const sendForgotPasswordEmail = (
  toAddress: string,
  forgot_password_token: string,
  template: string = verifyEmailTemplate
) => {
  const link = `${process.env.CLIENT_URL}/forgot-password?token=${forgot_password_token}`

  const filledTemplate = template
    .replace('{{title}}', 'Vui lòng xác minh email của bạn')
    .replace('{{content}}', 'Nhấn vào nút để xác minh email của bạn trước khi có thể đặt lại mật khẩu')
    .replace('{{titleLink}}', 'Đặt lại mật khẩu')
    .replace('{{link}}', link)

  return sendVerifyEmail(toAddress, 'Xác minh email để đặt lại mật khẩu của bạn', filledTemplate)
}
