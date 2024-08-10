import {
    IPropertyQuery,
    PropertyQuery,
} from '@infrastructure/repository/property-query';

export class QueryBuilder {
    protected _userId: IPropertyQuery<string, 'equals'>;
    get userId() {
        return this._userId;
    }
    constructor() {
        this._userId = new PropertyQuery();
    }
}
