import { Entity, Column, CreateDateColumn, UpdateDateColumn, Index, PrimaryColumn, Generated } from "typeorm";

import { IsNotEmpty } from "class-validator";

@Entity()
@Index(["id", "userId"])
export class Credit {
    @Column({ type: "varchar", nullable: false })
    @Generated("uuid")
    id?: string;

    @PrimaryColumn()
    @IsNotEmpty()
    userId!: string;

    @Column({ type: "numeric", nullable: false })
    @IsNotEmpty()
    credit!: number;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;
}
