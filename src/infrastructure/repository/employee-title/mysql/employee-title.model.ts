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

@Entity({ name: 'titles' })
export class EmployeeTitle extends BaseEntity {
    @PrimaryColumn({ name: 'emp_no' })
    employeeNo: number;
    @PrimaryColumn({ name: 'title', type: 'varchar', length: 50 })
    title: string;
    @PrimaryColumn({
        name: 'from_date',
        type: 'date',
        transformer: {
            to: (value) => value,
            from: (value) => new Date(value),
        },
    })
    fromDate: Date;
    @Index('ix_todate')
    @Column({
        name: 'to_date',
        type: 'date',
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
