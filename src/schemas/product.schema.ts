
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

// ─── Nested Schema for Package Dimensions ───
@Schema({ _id: false })
export class PackageDetail {
    @Prop()
    length?: number;    // cm

    @Prop()
    breadth?: number;   // cm

    @Prop()
    height?: number;    // cm

    @Prop()
    weight?: number;    // grams
}

// ─── Nested Schema for Product Offer ───
@Schema({ _id: false })
export class Offer {
    @Prop()
    title?: string; // e.g. "Buy 2 Get 1 Free"

    @Prop()
    description?: string;

    @Prop({ default: 'BOGO', enum: ['BOGO', 'PERCENTAGE', 'FLAT'] })
    type?: string;

    @Prop({ default: 2 })
    buyQuantity?: number;

    @Prop({ default: 1 })
    getFreeQuantity?: number;

    @Prop({ default: 0 })
    discountPercentage?: number;

    @Prop({ default: 0 })
    flatDiscount?: number;

    @Prop({ default: 1 })
    minQuantity?: number;

    @Prop({ default: true })
    isActive?: boolean;
}

@Schema({ timestamps: true })
export class Product {

    /* ── Core Info ── */
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop()
    detailedDescription: string;

    /* ── Pricing ── */
    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    mrp: number;

    @Prop()
    offerDescription: string;       // e.g. "Buy 2 Get 1 Free"

    @Prop({ type: SchemaFactory.createForClass(Offer) })
    offer?: Offer;

    /* ── Media ── */
    @Prop({ type: [String], default: [] })
    images: string[];

    /* ── Classification ── */
    @Prop({ required: true })
    category: string;

    @Prop()
    quantity: string;               // e.g. "500ml", "100 tablets"

    @Prop()
    form: string;                   // e.g. "Tablet", "Liquid", "Cream"

    @Prop()
    containerType: string;          // e.g. "Bottle", "Blister Pack", "Tube"

    @Prop()
    applicationArea: string;        // e.g. "Face", "Body", "Scalp"

    @Prop()
    packOf: number;                 // e.g. 1, 3, 6

    @Prop()
    idealsFor: string;              // e.g. "Men", "Women", "All Skin Types"

    @Prop()
    licenseNumber: string;          // Drug / FSSAI / manufacturing licence

    @Prop({ type: [String], default: [] })
    itemIncluded: string[];         // e.g. ["1 Bottle", "1 Dropper"]

    /* ── Product Details ── */
    @Prop({ type: [String], default: [] })
    keyFeatures: string[];          // Bullet-point feature highlights

    @Prop({ type: [String], default: [] })
    keySpecs: string[];             // Technical specs, e.g. ["SPF 50", "pH 5.5"]

    @Prop({ type: [String], default: [] })
    composition: string[];          // Active ingredients / formula breakdown

    @Prop({ type: [String], default: [] })
    ingredients: string[];          // Full ingredient list

    @Prop({ type: [String], default: [] })
    benefits: string[];

    @Prop({ type: [String], default: [] })
    sideEffects: string[];

    @Prop()
    developmentStory: string;

    /* ── Shelf Life ── */
    @Prop()
    maximumShelfLife: string;       // e.g. "24 months from manufacture date"

    /* ── Package Details ── */
    @Prop({ type: PackageDetail })
    packageDetail: PackageDetail;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
