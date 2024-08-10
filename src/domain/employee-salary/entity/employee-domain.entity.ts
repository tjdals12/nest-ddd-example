export type EmployeeProperty = Pick<Employee, 'firstName' | 'lastName'>;

export class Employee {
    private _firstName: string;
    get firstName() {
        return this._firstName;
    }
    private _lastName: string;
    get lastName() {
        return this._lastName;
    }
    constructor(args: EmployeeProperty) {
        const { firstName, lastName } = args;
        this._firstName = firstName;
        this._lastName = lastName;
    }
}
