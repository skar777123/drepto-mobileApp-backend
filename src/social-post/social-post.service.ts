
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocialPost, SocialPostDocument } from '../schemas/social-post.schema';
import { CreateSocialPostDto, UpdateSocialPostDto } from '../dto/social-post.dto';

@Injectable()
export class SocialPostService {
    constructor(
        @InjectModel(SocialPost.name)
        private socialPostModel: Model<SocialPostDocument>,
    ) {}

    async create(dto: CreateSocialPostDto): Promise<SocialPost> {
        const created = new this.socialPostModel(dto);
        return created.save();
    }

    /** Returns only active posts, sorted by order then newest createdAt */
    async findAllActive(): Promise<SocialPost[]> {
        return this.socialPostModel
            .find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .exec();
    }

    /** Admin: returns ALL posts (active + inactive) */
    async findAll(): Promise<SocialPost[]> {
        return this.socialPostModel.find().sort({ order: 1, createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<SocialPost> {
        const post = await this.socialPostModel.findById(id).exec();
        if (!post) {
            throw new NotFoundException(`Social post with ID ${id} not found`);
        }
        return post;
    }

    async update(id: string, dto: UpdateSocialPostDto): Promise<SocialPost> {
        const updated = await this.socialPostModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();
        if (!updated) {
            throw new NotFoundException(`Social post with ID ${id} not found`);
        }
        return updated;
    }

    async remove(id: string): Promise<{ deleted: boolean }> {
        const result = await this.socialPostModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Social post with ID ${id} not found`);
        }
        return { deleted: true };
    }
}

