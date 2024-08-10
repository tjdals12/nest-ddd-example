import {
    IPropertyQuery,
    PropertyQuery,
} from '@infrastructure/repository/property-query';

export class QueryBuilder {
    protected _employeeNo: IPropertyQuery<number, 'equals'>;
    get employeeNo() {
        return this._employeeNo;
    }
    protected _fromDate: IPropertyQuery<Date, 'between'>;
    get fromDate() {
        return this._fromDate;
    }
    constructor() {
        this._employeeNo = new PropertyQuery();
        this._fromDate = new PropertyQuery();
    }
}
