import { Keyword, PublicationType } from 'src/app/shared/base-data';
export class Book {
    constructor(
        public id?: number,
        public nakId?: string,
        public inventoryId?: number,
        public title?: string,
        public authors?: string,
        public isbn?: string,
        public releaseDate?: string,
        public publisher?: string,
        public amountInStock?: number,
        public amountBorrowed?: number,
        public publicationType?: PublicationType | any,
        public keywords?: Keyword[] | any
    ) {}
}

export class InventoryEntry {
    constructor(
        public id?: number,
        public amountInStock?: number,
        public amountBorrowed?: number,
        public publication?: Book
    ) {}
}
