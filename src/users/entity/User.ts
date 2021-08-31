import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
} from "typeorm";

import { Length, IsEmail } from "class-validator";

@Entity()
@Index(["email"])
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", width: 50 })
    @IsEmail(undefined, { message: "Email not valid" })
    email!: string;

    @Column({ type: "varchar", width: 150, select: false })
    @Length(6, 150, {
        message: "Password is too short. Minimal length is $constraint1 characters",
    })
    password!: string;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;

    @DeleteDateColumn({ type: "timestamp with time zone" })
    deletedDate?: Date;
}
