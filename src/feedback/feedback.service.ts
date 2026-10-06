import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackDocument } from '../schemas/feedback.schema';
import { CreateFeedbackDto } from '../dto/feedback.dto';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>
    ) {}

    async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
        const createdFeedback = new this.feedbackModel(createFeedbackDto);
        return createdFeedback.save();
    }

    async findAllApproved(): Promise<Feedback[]> {
        return this.feedbackModel.find({ is_approved: true }).sort({ createdAt: -1 }).exec();
    }
}
