import { Book } from 'src/app/shared/book';
export default [
    {
        key: 1,
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        releaseDate: '1954-07-29',
        publisher: 'Allen & Unwin',
        publicationType: { id: 1, type: 'Book' },
        isbn: '978-0-261-10342-8',
        amountInStock: 5,
    },
    {
        key: 2,
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        releaseDate: '1937-09-21',
        publisher: 'Allen & Unwin',
        publicationType: { id: 1, type: 'Book' },
        isbn: '978-0-261-10342-8',
        amountInStock: 5,
    },
    {
        key: 3,
        title: 'The Silmarillion',
        author: 'J.R.R. Tolkien',
        releaseDate: '1977-09-15',
        publisher: 'Allen & Unwin',
        publicationType: { id: 1, type: 'Book' },
        isbn: '978-0-261-10342-8',
        amountInStock: 5,
    },
] as Book[];
