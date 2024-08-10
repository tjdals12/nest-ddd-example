import * as moment from 'moment';
import { Employee } from './employee-domain.entity';

export type EmployeeSalaryProperty = { type: 'create' | 'restore' } & Pick<
    EmployeeSalary,
    'employeeNo' | 'salary' | 'fromDate' | 'toDate' | 'employee'
>;

export class EmployeeSalary {
    private _employeeNo: number;
    get employeeNo() {
        return this._employeeNo;
    }
    private _salary: number;
    get salary() {
        return this._salary;
    }
    private _fromDate: Date;
    get fromDate() {
        return this._fromDate;
    }
    private _toDate: Date;
    get toDate() {
        return this._toDate;
    }
    private _employee: Employee;
    get employee() {
        return this._employee;
    }
    constructor(args: EmployeeSalaryProperty) {
        const { type, employeeNo, salary, fromDate, toDate, employee } = args;
        if (type === 'create') {
            if (this.validateDateRange(fromDate, toDate) === false)
                throw new Error('Invalid date');
        }
        this._employeeNo = employeeNo;
        this._salary = salary;
        this._fromDate = fromDate;
        this._toDate = toDate;
        this._employee = employee;
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
}
