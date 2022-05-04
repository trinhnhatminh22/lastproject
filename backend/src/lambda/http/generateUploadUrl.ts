import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import { createAttachmentPresignedUrl } from '../../service/BookService'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const bookId = event.pathParameters.bookId
    const userId = getUserId(event);
    const presignedUrl = await createAttachmentPresignedUrl(userId, bookId);

    return {
      statusCode: 200,
      body:  JSON.stringify({
        uploadUrl: presignedUrl,
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
