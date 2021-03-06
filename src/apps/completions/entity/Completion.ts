import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";

import { Length, IsNotEmpty } from "class-validator";
import { featureCompletion, resultCompletion, basicDataCompletion } from "../completion.interface";

@Entity()
@Index(["id", "userId"])
export class Completion {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "varchar", nullable: false })
    @Length(4, undefined, {
        message: "Prompt terlalu pendek. Minimal $constraint1 karakter",
    })
    @IsNotEmpty()
    prompt!: string;

    @Column({ type: "varchar", width: 2, nullable: false })
    @Length(2, undefined, {
        message: "Bahasa terlalu pendek. Minimal $constraint1 karakter",
    })
    @IsNotEmpty()
    language!: string;

    @Column("jsonb", { nullable: false })
    results?: resultCompletion[];

    @Column({ type: "varchar", nullable: false })
    @IsNotEmpty()
    userId!: string;

    @Column("jsonb", { nullable: false })
    feature!: featureCompletion;

    @Column("jsonb", { nullable: true })
    tones!: basicDataCompletion[];

    @Column("jsonb", { nullable: true })
    from!: basicDataCompletion;

    @Column("jsonb", { nullable: true })
    to!: basicDataCompletion;

    @Column("jsonb", { nullable: true })
    theme!: basicDataCompletion;

    @Column({ type: "varchar", nullable: true })
    @IsNotEmpty()
    brief?: string;

    @Column({ type: "numeric", nullable: false })
    @IsNotEmpty()
    count?: number;

    @Column({ type: "numeric", nullable: false })
    @IsNotEmpty()
    tokenUsage?: number;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;
}
