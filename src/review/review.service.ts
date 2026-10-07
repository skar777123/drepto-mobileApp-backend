import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';
import { Review, ReviewDocument } from '../schemas/review.schema';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>
    ) {}

    async create(createReviewDto: CreateReviewDto): Promise<Review> {
        const createdReview = new this.reviewModel(createReviewDto);
        return createdReview.save();
    }

    async findAll(): Promise<Review[]> {
        return this.reviewModel.find().populate('userId', 'firstName lastName').exec();
    }

    async findByProductId(productId: string): Promise<Review[]> {
        return this.reviewModel.find({ productId }).populate('userId', 'firstName lastName').exec();
    }

    async findByUserId(userId: string): Promise<Review[]> {
        return this.reviewModel.find({ userId }).populate('productId', 'name images').exec();
    }

    async findOne(id: string): Promise<Review> {
        const review = await this.reviewModel.findById(id).populate('userId', 'firstName lastName').exec();
        if (!review) {
            throw new NotFoundException(`Review #${id} not found`);
        }
        return review;
    }

    async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
        const existingReview = await this.reviewModel.findByIdAndUpdate(
            id,
            updateReviewDto,
            { new: true }
        ).exec();
        
        if (!existingReview) {
            throw new NotFoundException(`Review #${id} not found`);
        }
        return existingReview;
    }

    async remove(id: string): Promise<any> {
        const deletedReview = await this.reviewModel.findByIdAndDelete(id).exec();
        if (!deletedReview) {
            throw new NotFoundException(`Review #${id} not found`);
        }
        return deletedReview;
    }
}
