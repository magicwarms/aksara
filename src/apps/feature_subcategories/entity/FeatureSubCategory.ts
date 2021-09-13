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
} from "typeorm";

import { Length, IsNotEmpty, IsLowercase } from "class-validator";
import { FeatureCategory } from "../../feature_categories/entity/FeatureCategory";

@Entity()
@Index(["id"])
export class FeatureSubCategory {
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

    @Column({ type: "varchar", nullable: false })
    @IsNotEmpty()
    featureCategoryId!: string;

    @Column({ type: "varchar", nullable: false })
    @IsNotEmpty()
    featureCategoryKey!: string;

    @ManyToOne(() => FeatureCategory)
    @JoinColumn()
    feature_category?: FeatureCategory;

    @Column({ type: "bool", width: 1, nullable: false, default: true })
    isActive!: boolean;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;

    @DeleteDateColumn({ type: "timestamp with time zone" })
    deletedDate?: Date;
}
