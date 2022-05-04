import { BookAccess } from '../dataLayer/bookAccess';
import { AttachmentUtils } from '../helpers/attachmentUtils';
import * as uuid from 'uuid';
import { CreateBookRequest } from '../requests/CreateBookRequest';
import { BookItem } from '../models/BookItem';
import { UpdateBookRequest } from '../requests/UpdateBookRequest';
import { BookUpdate } from '../models/BookUpdate';

const bookAccess = new BookAccess();
const accessFile = new AttachmentUtils();

export async function createBook(createBookRequest: CreateBookRequest, userId: string): Promise<BookItem> {

    const bookId = uuid.v4();
    const timestamp = new Date().toISOString();

    return await bookAccess.createBook({
        userId: userId,
        bookId: bookId,
        createdAt: timestamp,
        name: createBookRequest.name,
        dueDate: createBookRequest.dueDate,
        done: false
    });
}

export async function deleteBook(bookId: string, userId: string) {
    await bookAccess.deleteBook(bookId, userId);
}

export async function createAttachmentPresignedUrl(userId: string, bookId: string): Promise<String> {
    const uploadUrl = await accessFile.getUploadUrl(bookId);
    const attachmentUrl = accessFile.getAttachmentUrl(bookId);
    await bookAccess.updateAttachmentUrl(userId, bookId, attachmentUrl);
    return uploadUrl;
}

export async function getAllBooks(userId: string): Promise<BookItem[]> {
    return bookAccess.getAllBooks(userId);
}

export async function updateBook(bookId: string, UpdateBookRequest: UpdateBookRequest, userId: string): Promise<BookUpdate> {

    return await bookAccess.updateBook({
        name: UpdateBookRequest.name,
        dueDate: UpdateBookRequest.dueDate,
        done: UpdateBookRequest.done
    },
        bookId,
        userId);
}