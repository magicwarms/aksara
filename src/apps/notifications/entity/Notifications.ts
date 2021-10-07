import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index
} from 'typeorm';

import { IsNotEmpty } from 'class-validator';

@Entity()
@Index(['id', 'userId'])
export class Notifications {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: 'varchar', nullable: false })
    @IsNotEmpty()
    userId!: string;

    @Column({ type: 'bool', width: 1, nullable: false, default: true })
    isRead!: boolean;

    @Column({ type: 'varchar', nullable: false })
    @IsNotEmpty()
    message!: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdDate?: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedDate?: Date;

    @DeleteDateColumn({ type: 'timestamp with time zone', select: false })
    deletedDate?: Date;
}
