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
import { categories, fromtoName } from "../fromto.inteface";

@Entity()
@Index(["id"])
export class FromTo {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column("jsonb", { nullable: false })
    @IsNotEmpty()
    key!: fromtoName;

    @Column("jsonb", { nullable: false })
    @IsNotEmpty()
    name!: fromtoName;

    @Column("jsonb", { nullable: true })
    @IsNotEmpty()
    categories!: categories[];

    @Column({ type: "bool", width: 1, nullable: false, default: true })
    isActive!: boolean;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;

    @DeleteDateColumn({ type: "timestamp with time zone" })
    deletedDate?: Date;
}
