import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
    OneToMany,
    JoinColumn,
} from "typeorm";

import { IsNotEmpty } from "class-validator";
import { FeatureCategory } from "../../feature_categories/entity/FeatureCategory";
import { featureName } from "../feature.interface";

@Entity()
@Index(["id"])
export class Feature {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column("jsonb", { nullable: false })
    @IsNotEmpty()
    key!: featureName;

    @Column("jsonb", { nullable: false })
    @IsNotEmpty()
    name!: featureName;

    @Column({ type: "bool", width: 1, nullable: false, default: true })
    isActive?: boolean;

    @OneToMany(() => FeatureCategory, (feature_category) => feature_category.feature, { eager: true })
    @JoinColumn()
    feature_categories?: FeatureCategory[];

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;

    @DeleteDateColumn({ type: "timestamp with time zone" })
    deletedDate?: Date;
}
