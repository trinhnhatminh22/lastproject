import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import { UpdateBookRequest } from '../../requests/UpdateBookRequest'
import { updateBook } from '../../service/BookService'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const bookId = event.pathParameters.todoId;
    const book: UpdateBookRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    await updateBook(bookId, book, userId);
    return {
      statusCode: 204,
      body: JSON.stringify({
        book
      })
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
