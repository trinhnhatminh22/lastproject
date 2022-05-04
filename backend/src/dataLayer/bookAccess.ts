import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
import { BookItem } from '../models/BookItem';
import { BookUpdate } from '../models/BookUpdate';

const logger = createLogger('BookAccess');

// TODO: Implement the dataLayer logic
export class BookAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly bookTable = process.env.BOOKS_TABLE) {
    }

    async getAllBooks(userId: string): Promise<BookItem[]> {
        console.log('Get all book with userId: ', userId);

        const result = await this.docClient.query({
            TableName: this.bookTable,
            KeyConditionExpression: '#userId =:i',
            ExpressionAttributeNames: {
                '#userId': 'userId'
            },
            ExpressionAttributeValues: {
                ':i': userId
            }
        }).promise();

        const items = result.Items;
        return items as BookItem[];
    }

    async createBook(book: BookItem): Promise<BookItem> {
        console.log('Creating new book');
        await this.docClient.put({
            TableName: this.bookTable,
            Item: book
        }).promise()
        console.log('Done create book');
        return book;
    }

    async updateBook(book: BookUpdate, userId: string, bookId: string): Promise<BookUpdate> {
        console.log(`Updating book: ${bookId} for userId: ${userId}`);
        const params = {
            TableName: this.bookTable,
            Key: {
                userId: userId,
                bookId: bookId
            },
            ExpressionAttributeNames: {
                '#book_name': 'name',
            },
            ExpressionAttributeValues: {
                ':name': book.name,
                ':dueDate': book.dueDate,
                ':done': book.done,
            },
            UpdateExpression: 'SET #book_name = :name, dueDate = :dueDate, done = :done',
            ReturnValues: 'ALL_NEW',
        };

        const result = await this.docClient.update(params).promise();

        logger.info('After update: ', { result: result });

        return result.Attributes as BookUpdate;
    }

    async updateAttachmentUrl(userId: string, bookId: string, attachmentUrl: string) {
        console.log(`updateAttachmentUrl for book ${bookId} of userId ${userId} with URL ${attachmentUrl}`)
        const params = {
            TableName: this.bookTable,
            Key: {
                userId: userId,
                bookId: bookId
            },
            ExpressionAttributeNames: {
                '#todo_attachmentUrl': 'attachmentUrl'
            },
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            },
            UpdateExpression: 'SET #todo_attachmentUrl = :attachmentUrl',
            ReturnValues: 'ALL_NEW',
        };

        const result = await this.docClient.update(params).promise();
        logger.info('After update statement', { result: result });
    }

    async deleteBook(bookId: string, userId: string) {
        console.log(`Deleting bookid ${bookId} of userId ${userId}`)
    
        await this.docClient.delete({
          TableName: this.bookTable,
          Key: {
            userId: userId,
            bookId: bookId
          }
        }).promise();
    
        logger.info('Deleted successfully');
      }
}

function createDynamoDBClient(): DocumentClient {
    const service = new AWS.DynamoDB();
    const client = new AWS.DynamoDB.DocumentClient({
        service: service
    });
    AWSXRay.captureAWSClient(service);
    return client;
}