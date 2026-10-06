import { Controller, Post, Body, Get } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from '../dto/feedback.dto';

@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @Post()
    async create(@Body() createFeedbackDto: CreateFeedbackDto) {
        return this.feedbackService.create(createFeedbackDto);
    }

    @Get()
    async findAllApproved() {
        return this.feedbackService.findAllApproved();
    }
}
