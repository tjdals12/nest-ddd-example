import * as moment from 'moment';

export type DepartmentManagerProperty = Pick<
    DepartmentManager,
    | 'departmentNo'
    | 'employeeNo'
    | 'firstName'
    | 'lastName'
    | 'fromDate'
    | 'toDate'
> & { type: 'create' | 'restore' };

export class DepartmentManager {
    private _departmentNo: string;
    get departmentNo() {
        return this._departmentNo;
    }
    private _employeeNo: number;
    get employeeNo() {
        return this._employeeNo;
    }
    private _firstName: string;
    get firstName() {
        return this._firstName;
    }
    private _lastName: string;
    get lastName() {
        return this._lastName;
    }
    private _fromDate: Date;
    get fromDate() {
        return this._fromDate;
    }
    private _toDate: Date;
    get toDate() {
        return this._toDate;
    }
    constructor(args: DepartmentManagerProperty) {
        const {
            type,
            departmentNo,
            employeeNo,
            firstName,
            lastName,
            fromDate,
            toDate,
        } = args;
        if (type === 'create') {
            if (this.validateDateRange(fromDate, toDate) === false)
                throw new Error('Invalid date');
        }
        this._departmentNo = departmentNo;
        this._employeeNo = employeeNo;
        this._firstName = firstName;
        this._lastName = lastName;
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

    update(args: Partial<Pick<DepartmentManager, 'toDate'>>) {
        const { toDate } = args;
        if (toDate !== undefined) {
            if (this.validateDate(toDate) === false)
                throw new Error('Invalid date');
            this._toDate = toDate;
        }
    }
}
