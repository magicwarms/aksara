import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
    Unique,
} from "typeorm";

import { Length, IsEmail, IsUrl } from "class-validator";

@Entity()
@Index(["id", "email"])
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "varchar", width: 50, nullable: false })
    @IsEmail(undefined, { message: "Email tidak valid" })
    email!: string;

    @Column({ type: "varchar", width: 150, nullable: false })
    @Length(2, 150, {
        message: "Nama depan terlalu pendek. Minimal $constraint1 karakter",
    })
    firstname!: string;

    @Column({ type: "varchar", width: 150, nullable: false })
    @Length(2, 150, {
        message: "Nama belakang terlalu pendek. Minimal $constraint1 karakter",
    })
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
    country!: string;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;

    @DeleteDateColumn({ type: "timestamp with time zone" })
    deletedDate?: Date;
}
