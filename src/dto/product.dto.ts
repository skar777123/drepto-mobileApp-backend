
import {
    IsString,
    IsNumber,
    IsOptional,
    IsArray,
    IsObject,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ─────────────────────────────────────────────
//  Nested DTO – Package Dimensions & Weight
// ─────────────────────────────────────────────
export class PackageDetailDto {
    @IsOptional()
    @IsNumber()
    length?: number;          // cm

    @IsOptional()
    @IsNumber()
    breadth?: number;         // cm

    @IsOptional()
    @IsNumber()
    height?: number;          // cm

    @IsOptional()
    @IsNumber()
    weight?: number;          // grams
}

// ─────────────────────────────────────────────
//  CREATE Product DTO
// ─────────────────────────────────────────────
export class CreateProductDto {

    /* ── Core Info ── */
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    detailedDescription?: string;

    /* ── Pricing ── */
    @IsNumber()
    price: number;

    @IsNumber()
    mrp: number;

    @IsOptional()
    @IsString()
    offerDescription?: string;      // e.g. "Buy 2 Get 1 Free"

    /* ── Media ── */
    @IsArray()
    @IsString({ each: true })
    images: string[];

    /* ── Classification ── */
    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    quantity?: string;              // e.g. "500ml", "100 tablets"

    @IsOptional()
    @IsString()
    form?: string;                  // e.g. "Tablet", "Liquid", "Cream"

    @IsOptional()
    @IsString()
    containerType?: string;         // e.g. "Bottle", "Blister Pack", "Tube"

    @IsOptional()
    @IsString()
    applicationArea?: string;       // e.g. "Face", "Body", "Scalp"

    @IsOptional()
    @IsNumber()
    packOf?: number;                // e.g. 1, 3, 6

    @IsOptional()
    @IsString()
    idealsFor?: string;             // e.g. "Men", "Women", "All Skin Types"

    @IsOptional()
    @IsString()
    licenseNumber?: string;         // Drug / FSSAI / manufacturing licence

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    itemIncluded?: string[];        // e.g. ["1 Bottle", "1 Dropper"]

    /* ── Product Details ── */
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    keyFeatures?: string[];         // Bullet-point feature highlights

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    keySpecs?: string[];            // Technical specs, e.g. ["SPF 50", "pH 5.5"]

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    composition?: string[];         // Active ingredients / formula breakdown

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    ingredients?: string[];         // Full ingredient list

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    benefits?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    sideEffects?: string[];

    @IsOptional()
    @IsString()
    developmentStory?: string;

    /* ── Shelf Life ── */
    @IsOptional()
    @IsString()
    maximumShelfLife?: string;      // e.g. "24 months from manufacture date"

    /* ── Package Details ── */
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => PackageDetailDto)
    packageDetail?: PackageDetailDto;
}

// ─────────────────────────────────────────────
//  UPDATE Product DTO  (all fields optional)
// ─────────────────────────────────────────────
export class UpdateProductDto {

    /* ── Core Info ── */
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    detailedDescription?: string;

    /* ── Pricing ── */
    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNumber()
    mrp?: number;

    @IsOptional()
    @IsString()
    offerDescription?: string;

    /* ── Media ── */
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    /* ── Classification ── */
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    quantity?: string;

    @IsOptional()
    @IsString()
    form?: string;

    @IsOptional()
    @IsString()
    containerType?: string;

    @IsOptional()
    @IsString()
    applicationArea?: string;

    @IsOptional()
    @IsNumber()
    packOf?: number;

    @IsOptional()
    @IsString()
    idealsFor?: string;

    @IsOptional()
    @IsString()
    licenseNumber?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    itemIncluded?: string[];

    /* ── Product Details ── */
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    keyFeatures?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    keySpecs?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    composition?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    ingredients?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    benefits?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    sideEffects?: string[];

    @IsOptional()
    @IsString()
    developmentStory?: string;

    /* ── Shelf Life ── */
    @IsOptional()
    @IsString()
    maximumShelfLife?: string;

    /* ── Package Details ── */
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => PackageDetailDto)
    packageDetail?: PackageDetailDto;
}
