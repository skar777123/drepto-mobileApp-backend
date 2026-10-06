import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';

@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post()
    create(@Body() createReviewDto: CreateReviewDto) {
        return this.reviewService.create(createReviewDto);
    }

    @Get()
    findAll() {
        return this.reviewService.findAll();
    }

    @Get('product/:productId')
    findByProductId(@Param('productId') productId: string) {
        return this.reviewService.findByProductId(productId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reviewService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
        return this.reviewService.update(id, updateReviewDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reviewService.remove(id);
    }
}
