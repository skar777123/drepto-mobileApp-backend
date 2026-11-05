import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsBoolean,
    IsNumber,
    Matches,
} from 'class-validator';

type Platform = 'instagram' | 'linkedin' | 'twitter' | 'reel' | 'video' | 'youtube';

export class CreateSocialPostDto {
    @IsEnum(['instagram', 'linkedin', 'twitter', 'reel', 'video', 'youtube'])
    @IsNotEmpty()
    platform: Platform;

    /**
     * For Instagram: paste the full reel/post URL.
     * e.g. https://www.instagram.com/reel/ABC123/
     * For Reel/Video: video URL or file link
     * For Twitter: https://twitter.com/handle/status/123
     * For LinkedIn: https://www.linkedin.com/embed/feed/update/urn:li:share:123
     */
    @IsString()
    @IsNotEmpty()
    embedUrl: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    videoUrl?: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsOptional()
    @IsString()
    caption?: string;

    /**
     * ISO date string — e.g. "2025-12-15"
     */
    @IsOptional()
    @IsString()
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
    @IsEnum(['instagram', 'linkedin', 'twitter', 'reel', 'video', 'youtube'])
    platform?: Platform;

    @IsOptional()
    @IsString()
    embedUrl?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    videoUrl?: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsOptional()
    @IsString()
    caption?: string;

    @IsOptional()
    @IsString()
    date?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsNumber()
    order?: number;
}
