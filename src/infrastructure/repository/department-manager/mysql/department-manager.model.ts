import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { Department } from '@infrastructure/repository/department/mysql';
import { Employee } from '@infrastructure/repository/employee/mysql';

@Entity({ name: 'dept_manager' })
export class DepartmentManager extends BaseEntity {
    @PrimaryColumn({ name: 'dept_no', type: 'char', length: 4 })
    departmentNo: string;
    @PrimaryColumn({ name: 'emp_no' })
    employeeNo: number;
    @Column({
        name: 'from_date',
        type: 'date',
        nullable: false,
        transformer: {
            to: (value) => value,
            from: (value) => new Date(value),
        },
    })
    fromDate: Date;
    @Column({
        name: 'to_date',
        type: 'date',
        nullable: false,
        transformer: {
            to: (value) => value,
            from: (value) => new Date(value),
        },
    })
    toDate: Date;

    @ManyToOne(() => Department)
    @JoinColumn({ name: 'dept_no', referencedColumnName: 'departmentNo' })
    department: Department;

    @ManyToOne(() => Employee)
    @JoinColumn({ name: 'emp_no', referencedColumnName: 'employeeNo' })
    employee: Employee;
}
