import * as moment from 'moment';

export type DepartmentEmployeeProperty = Pick<
    DepartmentEmployee,
    'departmentNo' | 'departmentName' | 'fromDate' | 'toDate'
> & { type: 'create' | 'restore' };

export class DepartmentEmployee {
    private _departmentNo: string;
    get departmentNo() {
        return this._departmentNo;
    }
    private _departmentName: string;
    get departmentName() {
        return this._departmentName;
    }
    private _fromDate: Date;
    get fromDate() {
        return this._fromDate;
    }
    private _toDate: Date;
    get toDate() {
        return this._toDate;
    }
    constructor(args: DepartmentEmployeeProperty) {
        const { type, departmentNo, departmentName, fromDate, toDate } = args;
        if (type === 'create') {
            if (this.validateDateRange(fromDate, toDate) === false)
                throw new Error('Invalid date');
        }
        this._departmentNo = departmentNo;
        this._departmentName = departmentName;
        this._fromDate = fromDate;
        this._toDate = toDate;
    }

    private validateDate(date: Date): boolean {
        if (date === null || date === undefined) return false;
        const onlyDate = moment(date).format('YYYY-MM-DD');
        if (moment(onlyDate).isSameOrAfter('1900-01-01') === false)
            return false;
        if (moment(onlyDate).isSameOrBefore('9999-12-31') === false)
            return false;
        return true;
    }

    private validateDateRange(fromDate: Date, toDate: Date) {
        if (this.validateDate(fromDate) === false) return false;
        if (this.validateDate(toDate) === false) return false;
        if (moment(fromDate).isBefore(toDate) === false) return false;
        return true;
    }

    update(args: Partial<Pick<DepartmentEmployee, 'toDate'>>) {
        const { toDate } = args;
        if (toDate !== undefined) {
            if (this.validateDateRange(this._fromDate, toDate) === false)
                throw new Error('Invalid date');
            this._toDate = toDate;
        }
    }
}
