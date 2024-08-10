import {
    IPropertyQuery,
    PropertyQuery,
} from '@infrastructure/repository/property-query';

export class QueryBuilder {
    protected _departmentNo: IPropertyQuery<string, 'equals'>;
    get departmentNo() {
        return this._departmentNo;
    }
    protected _departmentName: IPropertyQuery<string, 'equals'>;
    get departmentName() {
        return this._departmentName;
    }
    constructor() {
        this._departmentNo = new PropertyQuery();
        this._departmentName = new PropertyQuery();
    }
}
