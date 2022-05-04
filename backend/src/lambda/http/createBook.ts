import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getUserId } from '../utils';
import { CreateBookRequest } from '../../requests/CreateBookRequest'
import { createBook } from '../../service/BookService';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newBook: CreateBookRequest = JSON.parse(event.body);
    const userId = getUserId(event);
   
    const bookItem = await createBook(newBook, userId);
    return {
      statusCode: 201,
      body: JSON.stringify({
        bookItem
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)

