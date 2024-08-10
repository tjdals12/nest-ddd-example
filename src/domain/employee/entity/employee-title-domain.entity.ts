import * as moment from 'moment';

export type EmployeeTitleProperty = Pick<
    EmployeeTitle,
    'title' | 'fromDate' | 'toDate'
> & { type: 'create' | 'restore' };

export class EmployeeTitle {
    private _title: string;
    get title() {
        return this._title;
    }
    private _fromDate;
    get fromDate() {
        return this._fromDate;
    }
    private _toDate;
    get toDate() {
        return this._toDate;
    }

    constructor(args: EmployeeTitleProperty) {
        const { type, title, fromDate, toDate } = args;
        if (type === 'create') {
            if (this.validateDateRange(fromDate, toDate) === false)
                throw new Error('Invalid date');
        }
        this._title = title;
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

    update(args: Pick<EmployeeTitle, 'toDate'>) {
        const { toDate } = args;
        if (toDate !== undefined) {
            if (this.validateDateRange(this._fromDate, toDate) === false)
                throw new Error('Invalid date');
            this._toDate = toDate;
        }
    }
}
