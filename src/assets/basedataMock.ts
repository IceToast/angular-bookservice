import { Borrower, Keyword, PublicationType } from 'src/app/shared/base-data';

export const PUBLICATION_TYPES: PublicationType[] = [
    { id: 1, type: 'Book' },
    { id: 2, type: 'Magazine' },
    { id: 3, type: 'Journal' },
    { id: 4, type: 'Newspaper' },
    { id: 5, type: 'Thesis' },
    { id: 6, type: 'Other' },
];

export const BORROWERS: Borrower[] = [
    { id: 1, firstName: 'John', surName: 'Doe', matriculationNumber: 123456 },
    { id: 2, firstName: 'Jane', surName: 'Doe', matriculationNumber: 123457 },
    {
        id: 3,
        firstName: 'Max',
        surName: 'Mustermann',
        matriculationNumber: 123458,
    },
    {
        id: 4,
        firstName: 'Maxine',
        surName: 'Mustermann',
        matriculationNumber: 123459,
    },
    {
        id: 5,
        firstName: 'Maximilian',
        surName: 'Mustermann',
        matriculationNumber: 123460,
    },
];

export const KEYWORDS: Keyword[] = [
    { id: 1, keyword: 'Fantasy' },
    { id: 2, keyword: 'Science Fiction' },
    { id: 3, keyword: 'Horror' },
    { id: 4, keyword: 'Romance' },
    { id: 5, keyword: 'Thriller' },
    { id: 6, keyword: 'Mystery' },
    { id: 7, keyword: 'Crime' },
];
