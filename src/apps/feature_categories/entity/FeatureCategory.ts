import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";

import { Length, IsNotEmpty, IsLowercase } from "class-validator";
import { Feature } from "../../features/entity/Feature";
import { FeatureSubCategory } from "../../feature_subcategories/entity/FeatureSubCategory";

@Entity()
@Index(["id"])
export class FeatureCategory {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "varchar", width: 50, nullable: false })
    @IsNotEmpty()
    @IsLowercase()
    key!: string;

    @Column({ type: "varchar", width: 50, nullable: false })
    @Length(2, 50, {
        message: "Nama terlalu pendek. Minimal $constraint1 karakter",
    })
    @IsNotEmpty()
    name!: string;

    @Column({ type: "varchar", nullable: false, select: false })
    @IsNotEmpty()
    featureId!: string;

    @ManyToOne(() => Feature)
    @JoinColumn()
    feature?: Feature;

    @OneToMany(() => FeatureSubCategory, (feature_subcategory) => feature_subcategory.feature_category, { eager: true })
    @JoinColumn()
    feature_subcategories?: FeatureSubCategory[];

    @Column({ type: "bool", width: 1, nullable: false, default: true })
    isActive!: boolean;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;

    @DeleteDateColumn({ type: "timestamp with time zone" })
    deletedDate?: Date;
}
