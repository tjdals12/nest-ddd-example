import {
    Entity,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User extends BaseEntity {
    @PrimaryColumn({ name: 'user_id' })
    userId: string;
    @Column({ name: 'password', nullable: false })
    password: string;
    @Column({ name: 'user_name', nullable: false })
    userName: string;
    @Column({
        name: 'is_enabled',
        nullable: false,
        default: false,
    })
    isEnabled: boolean;
    @CreateDateColumn({
        name: 'created_at',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP(6)',
        transformer: {
            to: (value) => value,
            from: (value) => new Date(value),
        },
    })
    createdAt: Date;
    @UpdateDateColumn({
        name: 'updated_at',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP(6)',
        transformer: {
            to: (value) => value,
            from: (value) => new Date(value),
        },
    })
    updatedAt: Date;
}
