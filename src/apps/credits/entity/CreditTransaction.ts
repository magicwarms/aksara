import { Entity, Column, CreateDateColumn, Index, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";

import { IsNotEmpty } from "class-validator";
import { StatusHistory } from "../credit.enum";
import { Completion } from "../../completions/entity/Completion";

@Entity()
@Index(["id", "userId", "status"])
export class CreditTransaction {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "varchar", nullable: false })
    @IsNotEmpty()
    userId!: string;

    @Column({ type: "numeric", nullable: false, default: 0 })
    @IsNotEmpty()
    usage!: number;

    @Column({ type: "varchar", nullable: true })
    completionId?: string | null;

    @OneToOne(() => Completion, { eager: true })
    @JoinColumn()
    completion?: Completion;

    @Column({ type: "numeric", nullable: false, default: 0 })
    @IsNotEmpty()
    remainingCredits!: number;

    @Column({ type: "enum", enum: StatusHistory, default: StatusHistory.ADDED, width: 6, nullable: false })
    status!: StatusHistory;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;
}
