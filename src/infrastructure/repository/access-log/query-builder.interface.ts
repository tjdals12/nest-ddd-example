import {
    IPropertyQuery,
    PropertyQuery,
} from '@infrastructure/repository/property-query';

export class QueryBuilder {
    protected _date: IPropertyQuery<
        Date,
        'greaterThanOrEquals' | 'lessThanOrEquals' | 'between'
    >;
    get date() {
        return this._date;
    }
    constructor() {
        this._date = new PropertyQuery();
    }
}
