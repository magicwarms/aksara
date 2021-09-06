import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
} from "typeorm";

import { Length, IsEmail, IsUrl, IsNotEmpty, IsLowercase } from "class-validator";

import { Roles } from "../user.enum";

@Entity()
@Index(["id", "email"])
export class User {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "varchar", width: 50, nullable: false })
    @IsEmail(undefined, { message: "Email tidak valid" })
    @IsNotEmpty()
    @IsLowercase()
    email!: string;

    @Column({ type: "varchar", width: 150, nullable: false })
    @Length(2, 150, {
        message: "Nama depan terlalu pendek. Minimal $constraint1 karakter",
    })
    @IsNotEmpty()
    firstname!: string;

    @Column({ type: "varchar", width: 150, nullable: false })
    @Length(2, 150, {
        message: "Nama belakang terlalu pendek. Minimal $constraint1 karakter",
    })
    @IsNotEmpty()
    lastname!: string;

    @Column({ type: "varchar", nullable: false })
    @IsUrl(undefined, {
        message: "Profile foto harus berbentuk url",
    })
    profilePicture!: string;

    @Column({ type: "varchar", width: 30, nullable: false })
    @Length(2, 30, {
        message: "Negara terlalu pendek. Minimal $constraint1 karakter",
    })
    @IsNotEmpty()
    country!: string;

    @Column({ type: "enum", enum: Roles, default: Roles.CUSTOMER, width: 8, nullable: false })
    role!: Roles;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;

    @DeleteDateColumn({ type: "timestamp with time zone" })
    deletedDate?: Date;
}
