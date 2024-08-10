import {
    DepartmentEmployee,
    Employee,
    EmployeeSalary,
    EmployeeTitle,
} from '@domain/employee/entity';

export class DepartmentEmployeeDto {
    departmentNo: string;
    departmentName: string;
    fromDate: Date;
    toDate: Date;
    constructor(entity: DepartmentEmployee) {
        this.departmentNo = entity.departmentNo;
        this.departmentName = entity.departmentName;
        this.fromDate = entity.fromDate;
        this.toDate = entity.toDate;
    }
}

export class EmployeeTitleDto {
    title: string;
    fromDate: Date;
    toDate: Date;
    constructor(entity: EmployeeTitle) {
        this.title = entity.title;
        this.fromDate = entity.fromDate;
        this.toDate = entity.toDate;
    }
}

export class EmployeeSalaryDto {
    salary: number;
    fromDate: Date;
    toDate: Date;
    constructor(entity: EmployeeSalary) {
        this.salary = entity.salary;
        this.fromDate = entity.fromDate;
        this.toDate = entity.toDate;
    }
}

export class EmployeeDto {
    employeeNo: number;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: Date;
    hireDate: Date;
    departments: DepartmentEmployeeDto[];
    titles: EmployeeTitleDto[];
    latestSalary: EmployeeSalaryDto;
    constructor(entity: Employee) {
        this.employeeNo = entity.employeeNo;
        this.firstName = entity.firstName;
        this.lastName = entity.lastName;
        this.gender = entity.gender;
        this.birthDate = entity.birthDate;
        this.hireDate = entity.hireDate;
        this.departments = entity.departments.map(
            (v) => new DepartmentEmployeeDto(v),
        );
        this.titles = entity.titles.map((v) => new EmployeeTitleDto(v));
        this.latestSalary = entity.latestSalary
            ? new EmployeeSalaryDto(entity.latestSalary)
            : null;
    }
}
