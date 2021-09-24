import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { IsNotEmpty } from "class-validator";
import { Completion } from "../../completions/entity/Completion";

@Entity()
@Index(["id", "userId"])
export class Favorite {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "varchar", nullable: false })
    @IsNotEmpty()
    userId!: string;

    @Column({ type: "varchar", nullable: true })
    @IsNotEmpty()
    completionId!: string;

    @ManyToOne(() => Completion, { eager: true })
    @JoinColumn({ name: "completionId" })
    completion!: Completion;

    @Column({ type: "varchar", nullable: false })
    @IsNotEmpty()
    completionMsg!: string;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;

    @DeleteDateColumn({ type: "timestamp with time zone", select: false })
    deletedDate?: Date;
}
