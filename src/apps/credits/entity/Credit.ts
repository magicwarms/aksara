import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    Generated,
} from "typeorm";

import { IsNotEmpty } from "class-validator";
import { User } from "../../users/entity/User";

@Entity()
@Index(["id", "userId"])
export class Credit {
    @Column({ type: "varchar", nullable: false })
    @Generated("uuid")
    id?: string;

    @PrimaryColumn()
    @IsNotEmpty()
    userId!: string;

    @OneToOne(() => User, { eager: true })
    @JoinColumn()
    user?: User;

    @Column({ type: "numeric", nullable: false })
    @IsNotEmpty()
    credit!: number;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;
}
