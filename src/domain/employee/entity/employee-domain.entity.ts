import * as moment from 'moment';
import { DepartmentEmployee } from './department-employee-domain.entity';
import { EmployeeTitle } from './employee-title-domain.entity';
import { EmployeeSalary } from './employee-salary-domain.entity';

export type EmployeProperty = { type: 'create' | 'restore' } & Pick<
    Employee,
    | 'employeeNo'
    | 'firstName'
    | 'lastName'
    | 'gender'
    | 'birthDate'
    | 'hireDate'
    | 'departments'
    | 'titles'
    | 'latestSalary'
>;

export class Employee {
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
    private _gender: 'M' | 'F';
    get gender() {
        return this._gender;
    }
    private _birthDate: Date;
    get birthDate() {
        return this._birthDate;
    }
    private _hireDate: Date;
    get hireDate() {
        return this._hireDate;
    }
    private _departments: DepartmentEmployee[];
    get departments() {
        return this._departments;
    }
    private _titles: EmployeeTitle[];
    get titles() {
        return this._titles;
    }
    private _latestSalary: EmployeeSalary;
    get latestSalary() {
        return this._latestSalary;
    }
    constructor(args: EmployeProperty) {
        const {
            type,
            employeeNo,
            firstName,
            lastName,
            gender,
            birthDate,
            hireDate,
            departments,
            titles,
            latestSalary,
        } = args;
        if (type === 'create') {
            if (this.validateName(firstName) === false)
                throw new Error('Invalid firstName');
            if (this.validateName(lastName) === false)
                throw new Error('Invalid lastName');
            if (this.validateGender(gender) === false)
                throw new Error('Invalid gender');
            if (this.validateBirthDate(birthDate) === false)
                throw new Error('Invalid birthDate');
            if (this.validateHireDate(hireDate) === false)
                throw new Error('Invalid hireDate');
            this._firstName =
                firstName[0].toUpperCase() +
                firstName.substring(1, firstName.length).toLowerCase();
            this._lastName =
                lastName[0].toUpperCase() +
                lastName.substring(1, lastName.length).toLowerCase();
        } else if (type === 'restore') {
            this._firstName = firstName;
            this._lastName = lastName;
        }
        this._employeeNo = employeeNo;
        this._gender = gender;
        this._birthDate = birthDate;
        this._hireDate = hireDate;
        this._departments = departments;
        this._titles = titles;
        this._latestSalary = latestSalary;
    }
    private validateName(name: string): boolean {
        if (name === null || name === undefined) return false;
        const regex = /^(?=.*[a-zA-Z가-힣])[a-zA-Z가-힣]{2,16}$/g;
        return regex.test(name);
    }
    private validateGender(gender: Employee['gender']) {
        if (gender === null || gender === undefined) return false;
        return ['M', 'F'].includes(gender);
    }
    private validateBirthDate(birthDate: Date): boolean {
        if (birthDate === null || birthDate === undefined) return false;
        if (moment(birthDate).isBetween('1900-01-01', Date.now()) === false)
            return false;
        return true;
    }
    private validateHireDate(hireDate: Date): boolean {
        if (hireDate === null || hireDate === undefined) return false;
        if (moment(hireDate).isBetween('1900-01-01', Date.now()) === false)
            return false;
        return true;
    }
    update(
        args: Partial<
            Pick<
                Employee,
                'firstName' | 'lastName' | 'gender' | 'birthDate' | 'hireDate'
            >
        >,
    ) {
        const { firstName, lastName, gender, birthDate, hireDate } = args;
        if (firstName !== undefined) {
            if (this.validateName(firstName) === false)
                throw new Error('Invalid firstName');
            this._firstName = firstName;
        }
        if (lastName !== undefined) {
            if (this.validateName(lastName) === false)
                throw new Error('Invalid lastName');
            this._lastName = lastName;
        }
        if (gender !== undefined) {
            if (this.validateGender(gender) === false)
                throw new Error('Invalid gender');
            this._gender = gender;
        }
        if (birthDate !== undefined) {
            if (this.validateBirthDate(birthDate) === false)
                throw new Error('Invalid birthDate');
            this._birthDate = birthDate;
        }
        if (hireDate !== undefined) {
            if (this.validateHireDate(hireDate) === false)
                throw new Error('Invalid hireDate');
            this._hireDate = hireDate;
        }
    }
    changeDepartment(departmentEmployee: DepartmentEmployee) {
        const lastDepartment = this._departments.find((v) =>
            moment(v.toDate).isSameOrAfter(departmentEmployee.fromDate),
        );
        if (lastDepartment) {
            lastDepartment.update({ toDate: departmentEmployee.fromDate });
        }
        const sameDepartment = this._departments.find(
            (v) => v.departmentNo === departmentEmployee.departmentNo,
        );
        if (sameDepartment) {
            sameDepartment.update({ toDate: departmentEmployee.toDate });
        } else {
            this._departments.push(departmentEmployee);
        }
    }
    changeTitle(employeeTitle: EmployeeTitle) {
        const lastTitle = this._titles.find((v) =>
            moment(v.toDate).isSameOrAfter(employeeTitle.fromDate),
        );
        if (lastTitle) {
            lastTitle.update({ toDate: employeeTitle.fromDate });
        }
        const sameTitle = this._titles.find(
            (v) =>
                v.title === employeeTitle.title &&
                moment(v.fromDate).format('YYYY-MM-DD') ===
                    moment(employeeTitle.fromDate).format('YYYY-MM-DD'),
        );
        if (sameTitle) {
            sameTitle.update({ toDate: employeeTitle.toDate });
        } else {
            this._titles.push(employeeTitle);
        }
    }
}
