
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { SocialPostService } from './social-post.service';
import { CreateSocialPostDto, UpdateSocialPostDto } from '../dto/social-post.dto';
import { Public } from '../auth/public.decorator';

@Controller('social-posts')
export class SocialPostController {
    constructor(private readonly socialPostService: SocialPostService) {}

    // ── PUBLIC ENDPOINTS ──────────────────────────────────────────────────────

    /** Frontend calls this to fetch all ACTIVE posts for the Social Media Blog page */
    @Public()
    @Get()
    findAllActive() {
        return this.socialPostService.findAllActive();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.socialPostService.findOne(id);
    }

    // ── ADMIN / PROTECTED ENDPOINTS ───────────────────────────────────────────

    /** Admin panel: creates a new social post (Instagram reel link, LinkedIn, Twitter) */
    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    create(@Body() dto: CreateSocialPostDto) {
        return this.socialPostService.create(dto);
    }

    /** Admin panel: get every post (including inactive ones) */
    @Get('admin/all')
    findAll() {
        return this.socialPostService.findAll();
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    update(@Param('id') id: string, @Body() dto: UpdateSocialPostDto) {
        return this.socialPostService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.socialPostService.remove(id);
    }
}

