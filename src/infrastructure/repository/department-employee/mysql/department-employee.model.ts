import {
    BaseEntity,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { Employee } from '@infrastructure/repository/employee/mysql';
import { Department } from '@infrastructure/repository/department/mysql';

@Entity({ name: 'dept_emp' })
export class DepartmentEmployee extends BaseEntity {
    @Index('ix_empno_from_date')
    @PrimaryColumn({ name: 'emp_no' })
    employeeNo: number;
    @PrimaryColumn({ name: 'dept_no', type: 'char', length: 4 })
    departmentNo: string;
    @Index('ix_empno_from_date')
    @Index('ix_from_date')
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

    @ManyToOne(() => Employee)
    @JoinColumn({ name: 'emp_no', referencedColumnName: 'employeeNo' })
    employee: Employee;

    @ManyToOne(() => Department)
    @JoinColumn({ name: 'dept_no', referencedColumnName: 'departmentNo' })
    department: Department;
}
