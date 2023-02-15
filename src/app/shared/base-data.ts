export class PublicationType {
    constructor(public id?: number, public type?: string) {}
}

export class Borrower {
    constructor(
        public id?: number,
        public firstName?: string,
        public surName?: string,
        public matriculationNumber?: number
    ) {}
}

export class Keyword {
    constructor(public id?: number, public keyword?: string) {}
}
