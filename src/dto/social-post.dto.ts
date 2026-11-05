
import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsUrl,
    Matches,
} from 'class-validator';

type Platform = 'instagram' | 'linkedin' | 'twitter';

export class CreateSocialPostDto {
    @IsEnum(['instagram', 'linkedin', 'twitter'])
    @IsNotEmpty()
    platform: Platform;

    /**
     * For Instagram: paste the full reel/post URL.
     * e.g. https://www.instagram.com/reel/ABC123/
     *      https://www.instagram.com/p/ABC123/
     * For Twitter: https://twitter.com/handle/status/123
     * For LinkedIn: https://www.linkedin.com/embed/feed/update/urn:li:share:123
     */
    @IsString()
    @IsNotEmpty()
    @IsUrl({ require_tld: true }, { message: 'embedUrl must be a valid URL' })
    embedUrl: string;

    @IsOptional()
    @IsString()
    caption?: string;

    /**
     * ISO date string — e.g. "2025-12-15"
     */
    @IsOptional()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in YYYY-MM-DD format' })
    date?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsNumber()
    order?: number;
}

export class UpdateSocialPostDto {
    @IsOptional()
    @IsEnum(['instagram', 'linkedin', 'twitter'])
    platform?: Platform;

    @IsOptional()
    @IsString()
    @IsUrl({ require_tld: true }, { message: 'embedUrl must be a valid URL' })
    embedUrl?: string;

    @IsOptional()
    @IsString()
    caption?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in YYYY-MM-DD format' })
    date?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsNumber()
    order?: number;
}

