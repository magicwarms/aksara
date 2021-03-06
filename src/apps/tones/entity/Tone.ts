import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
} from "typeorm";

import { IsNotEmpty } from "class-validator";
import { categories, toneName } from "../tone.interface";

@Entity()
@Index(["id"])
export class Tone {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "varchar", nullable: false })
    @IsNotEmpty()
    key!: string;

    @Column("jsonb", { nullable: false })
    @IsNotEmpty()
    name!: toneName;

    @Column("jsonb", { nullable: true })
    @IsNotEmpty()
    categories!: categories[];

    @Column({ type: "bool", width: 1, nullable: false, default: true })
    isActive!: boolean;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;

    @DeleteDateColumn({ type: "timestamp with time zone", select: false })
    deletedDate?: Date;
}
