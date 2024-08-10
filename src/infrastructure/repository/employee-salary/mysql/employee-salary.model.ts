import { Employee } from '@infrastructure/repository/employee/mysql';
import {
    BaseEntity,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'salaries' })
export class EmployeeSalary extends BaseEntity {
    @PrimaryColumn({ name: 'emp_no' })
    employeeNo: number;
    @Index('ix_salary')
    @Column({ name: 'salary', nullable: false })
    salary: number;
    @PrimaryColumn({
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
}
