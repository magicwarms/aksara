import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

import { IsNotEmpty, Length } from "class-validator";
import { itemDetails } from "../payment.interface";

@Entity()
@Index(["id", "userId"])
export class Payment {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "varchar", nullable: false })
    @IsNotEmpty()
    userId!: string;

    @Column({ type: "varchar", nullable: false })
    @IsNotEmpty()
    transactionCode!: string;

    @Column({ type: "varchar", nullable: false })
    @Length(2, 2, { message: "Metode pembayaran terlalu pendek. Minimal $constraint1 karakter" })
    @IsNotEmpty()
    paymentMethod!: string;

    @Column({ type: "numeric", nullable: false })
    @IsNotEmpty()
    amountCreditPrice!: number;

    @Column({ type: "numeric", nullable: false })
    @IsNotEmpty()
    credits!: number;

    @Column({ type: "numeric", nullable: false })
    @IsNotEmpty()
    grandtotal!: number;

    @Column({ type: "varchar", nullable: false })
    @IsNotEmpty()
    orderDescription!: string;

    @Column("jsonb", { nullable: false })
    itemDetails!: itemDetails[];

    @Column({ type: "varchar", nullable: false })
    @IsNotEmpty()
    referenceDuitKuId!: string;

    @Column({ type: "varchar", width: 2, nullable: false })
    @IsNotEmpty()
    status!: string;

    @Column({ type: "varchar", width: 8, nullable: false })
    @IsNotEmpty()
    statusMessage!: string;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;
}