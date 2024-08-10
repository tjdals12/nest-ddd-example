import {
    IPropertyQuery,
    PropertyQuery,
} from '@infrastructure/repository/property-query';

export class QueryBuilder {
    protected _departmentNo: IPropertyQuery<string, 'equals'>;
    get departmentNo() {
        return this._departmentNo;
    }
    constructor() {
        this._departmentNo = new PropertyQuery();
    }
}
