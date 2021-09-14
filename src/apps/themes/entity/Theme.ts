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
import { themeName } from "../theme.interface";

@Entity()
@Index(["id"])
export class Theme {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column("jsonb", { nullable: false })
    @IsNotEmpty()
    key!: themeName;

    @Column("jsonb", { nullable: false })
    @IsNotEmpty()
    name!: themeName;

    @Column({ type: "bool", width: 1, nullable: false, default: true })
    isActive!: boolean;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;

    @DeleteDateColumn({ type: "timestamp with time zone" })
    deletedDate?: Date;
}
