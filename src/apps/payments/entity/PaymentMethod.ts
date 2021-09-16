import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    DeleteDateColumn,
} from "typeorm";

import { IsNotEmpty, Length } from "class-validator";

@Entity()
@Index(["id", "name"])
export class PaymentMethod {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "varchar", nullable: false })
    @Length(2, 2, { message: "Metode pembayaran terlalu pendek. Minimal $constraint1 karakter" })
    @IsNotEmpty()
    name!: string;

    @Column({ type: "bool", width: 1, nullable: false, default: true })
    isActive!: boolean;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;

    @DeleteDateColumn({ type: "timestamp with time zone" })
    deletedDate?: Date;
}
