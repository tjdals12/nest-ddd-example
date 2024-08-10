import { Entity, PrimaryColumn, Column, Index, BaseEntity } from 'typeorm';

@Entity({ name: 'departments' })
export class Department extends BaseEntity {
    @PrimaryColumn({ name: 'dept_no', type: 'char', length: 4 })
    departmentNo: string;
    @Index('ux_deptname', { unique: true })
    @Column({ name: 'dept_name', type: 'varchar', length: 40, nullable: false })
    departmentName: string;
}
