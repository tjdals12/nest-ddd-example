import {
    IPropertyQuery,
    PropertyQuery,
} from '@infrastructure/repository/property-query';

export class QueryBuilder {
    protected _employeeNo: IPropertyQuery<number, 'equals'>;
    get employeeNo() {
        return this._employeeNo;
    }
    constructor() {
        this._employeeNo = new PropertyQuery();
    }
}
