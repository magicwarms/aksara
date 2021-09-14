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

import { IsNotEmpty } from "class-validator";
import { FeatureCategory } from "../../feature_categories/entity/FeatureCategory";
import { featureSubCategoryName } from "../featuresubcategory.interface";

@Entity()
@Index(["id"])
export class FeatureSubCategory {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column("jsonb", { nullable: false })
    @IsNotEmpty()
    key!: featureSubCategoryName;

    @Column("jsonb", { nullable: false })
    @IsNotEmpty()
    name!: featureSubCategoryName;

    @Column({ type: "varchar", nullable: false })
    @IsNotEmpty()
    featureCategoryId!: string;

    @Column("jsonb", { nullable: false })
    @IsNotEmpty()
    featureCategoryKey!: featureSubCategoryName;

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
