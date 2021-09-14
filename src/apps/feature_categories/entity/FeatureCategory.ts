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

import { IsNotEmpty } from "class-validator";
import { Feature } from "../../features/entity/Feature";
import { FeatureSubCategory } from "../../feature_subcategories/entity/FeatureSubCategory";
import { featureCategoryName } from "../../feature_categories/featurecategory.interface";

@Entity()
@Index(["id"])
export class FeatureCategory {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column("jsonb", { nullable: false })
    @IsNotEmpty()
    key!: featureCategoryName;

    @Column("jsonb", { nullable: false })
    @IsNotEmpty()
    name!: featureCategoryName;

    @Column({ type: "varchar", nullable: false })
    @IsNotEmpty()
    featureId!: string;

    @Column("jsonb", { nullable: false })
    @IsNotEmpty()
    featureKey!: featureCategoryName;

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
