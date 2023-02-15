import { Book } from 'src/app/shared/book';
import { Borrower } from 'src/app/shared/base-data';
export class Borrowing {
    constructor(
        public id?: number,
        public borrower?: Borrower,
        public publication?: Book,
        public borrowDate?: string,
        public returnDate?: string
    ) {}
}

export class DunningProcess {
    constructor(
        public id?: number,
        public borrowingProcess?: Borrowing,
        public dunnings?: Dunning[],
        public lastDunningDate?: string
    ) {}
}

export class Dunning {
    constructor(public id?: number, public date?: string) {}
}
