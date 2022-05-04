import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils';
import { getAllBooks } from '../../service/BookService'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = getUserId(event);
    const books = await getAllBooks(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: books
      })
    }
})

handler.use(
  cors({
    credentials: true
  })
)
