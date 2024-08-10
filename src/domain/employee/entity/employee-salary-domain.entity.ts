export type EmployeeSalaryProperty = Pick<
    EmployeeSalary,
    'salary' | 'fromDate' | 'toDate'
>;

export class EmployeeSalary {
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

    constructor(args: EmployeeSalaryProperty) {
        const { salary, fromDate, toDate } = args;
        this._salary = salary;
        this._fromDate = fromDate;
        this._toDate = toDate;
    }
}
