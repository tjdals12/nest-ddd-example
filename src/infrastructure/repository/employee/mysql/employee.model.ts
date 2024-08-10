import {
    Entity,
    Column,
    Index,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import { Gender } from '../repository.interface';
import { DepartmentEmployee } from '@infrastructure/repository/department-employee/mysql';
import { EmployeeTitle } from '@infrastructure/repository/employee-title/mysql';
import { EmployeeSalary } from '@infrastructure/repository/employee-salary/mysql/employee-salary.model';

@Entity({ name: 'employees' })
export class Employee extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'emp_no' })
    employeeNo: number;
    @Index('ix_firstname')
    @Column({
        name: 'first_name',
        type: 'varchar',
        length: 16,
        nullable: false,
    })
    firstName: string;
    @Column({ name: 'last_name', type: 'varchar', length: 16, nullable: false })
    lastName: string;
    @Index('ix_gender_birthdate')
    @Column({ name: 'gender', type: 'enum', enum: Gender, nullable: false })
    gender: 'M' | 'F';
    @Index('ix_gender_birthdate')
    @Column({
        name: 'birth_date',
        type: 'date',
        nullable: false,
        transformer: {
            to: (value) => value,
            from: (value) => new Date(value),
        },
    })
    birthDate: Date;
    @Index('ix_hiredate')
    @Column({
        name: 'hire_date',
        type: 'date',
        nullable: false,
        transformer: {
            to: (value) => value,
            from: (value) => new Date(value),
        },
    })
    hireDate: Date;

    @OneToMany(
        () => DepartmentEmployee,
        (departmentEmployee) => departmentEmployee.employee,
    )
    departmentEmployees: DepartmentEmployee[];

    @OneToMany(() => EmployeeTitle, (employeeTitle) => employeeTitle.employee)
    employeeTitles: EmployeeTitle[];

    @OneToMany(
        () => EmployeeSalary,
        (employeeSalary) => employeeSalary.employee,
    )
    employeeSalaries: EmployeeSalary[];
}
