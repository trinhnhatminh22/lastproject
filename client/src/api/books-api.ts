import { apiEndpoint } from '../config'
import { Book } from '../types/Book';
import { CreateBookRequest } from '../types/CreateTBookRequest';
import Axios from 'axios'
import { UpdateBookRequest } from '../types/UpdateBookRequest';

export async function getBooks(idToken: string): Promise<Book[]> {
  console.log('Fetching Books')

  const response = await Axios.get(`${apiEndpoint}/books`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Books:', response.data)
  return response.data.items
}

export async function createBook(
  idToken: string,
  newBook: CreateBookRequest
): Promise<Book> {
  console.log('go here', newBook);
  const response = await Axios.post(`${apiEndpoint}/books`,  JSON.stringify(newBook), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log("response", response.data)
  return response.data.bookItem
}

export async function patchBook(
  idToken: string,
  bookId: string,
  updateBook: UpdateBookRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/books/${bookId}`, JSON.stringify(updateBook), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteBook(
  idToken: string,
  bookId: string
): Promise<void> {
  console.log('delete');
  await Axios.delete(`${apiEndpoint}/books/${bookId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  bookId: string
): Promise<string> {
  console.log('here');
  const response = await Axios.post(`${apiEndpoint}/books/${bookId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log('after', response.data);
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  console.log('upload file' );
  await Axios.put(uploadUrl, file)
}
