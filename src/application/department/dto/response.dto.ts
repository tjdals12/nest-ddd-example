import { Department } from '@domain/department/entity';
import { DepartmentManager } from '@domain/department-manager/entity';
import { DepartmentEmployee } from '@domain/department-employee/entity';

export class DepartmentEmployeeDto {
    departmentNo: string;
    employeeNo: number;
    firstName: string;
    lastName: string;
    fromDate: Date;
    toDate: Date;
    constructor(entity: DepartmentEmployee) {
        this.departmentNo = entity.departmentNo;
        this.employeeNo = entity.employeeNo;
        this.firstName = entity.firstName;
        this.lastName = entity.lastName;
        this.fromDate = entity.fromDate;
        this.toDate = entity.toDate;
    }
}

export class DepartmentDto {
    departmentNo: string;
    departmentName: string;
    constructor(entity: Department) {
        this.departmentNo = entity.departmentNo;
        this.departmentName = entity.departmentName;
    }
}

export class DepartmentManagerDto {
    departmentNo: string;
    employeeNo: number;
    firstName: string;
    lastName: string;
    fromDate: Date;
    toDate: Date;
    constructor(entity: DepartmentManager) {
        this.departmentNo = entity.departmentNo;
        this.employeeNo = entity.employeeNo;
        this.firstName = entity.firstName;
        this.lastName = entity.lastName;
        this.fromDate = entity.fromDate;
        this.toDate = entity.toDate;
    }
}
