export interface ValidateConstrainFilter {
    validateConstrainName?: string;
    regexValue?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    page: number | 1;
    size: number | 20;
    sort: string;
}

export interface ValidateConstrain {
    id: number;
    constrainName: string,
    description: string,
    regexValue: string,
    status: 'ACTIVE' | 'INACTIVE'
}

export interface ValidateConstrainCreate {
    constrainName: string,
    description: string,
    regexValue: string,
    status: 'ACTIVE' | 'INACTIVE'
}

export interface ValidateConstrainUpdate {
    constrainName: string,
    description: string,
    regexValue: string,
    status: 'ACTIVE' | 'INACTIVE'
}