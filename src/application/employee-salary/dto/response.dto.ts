import { Employee, EmployeeSalary } from '@domain/employee-salary/entity';

export class EmployeeDto {
    firstName: string;
    lastName: string;
    constructor(entity: Employee) {
        this.firstName = entity.firstName;
        this.lastName = entity.lastName;
    }
}

export class EmployeeSalaryDto {
    employeeNo: number;
    salary: number;
    fromDate: Date;
    toDate: Date;
    employee: EmployeeDto;
    constructor(entity: EmployeeSalary) {
        this.employeeNo = entity.employeeNo;
        this.salary = entity.salary;
        this.fromDate = entity.fromDate;
        this.toDate = entity.toDate;
        this.employee = new EmployeeDto(entity.employee);
    }
}
