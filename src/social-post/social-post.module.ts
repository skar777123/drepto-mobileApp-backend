
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialPostController } from './social-post.controller';
import { SocialPostService } from './social-post.service';
import { SocialPost, SocialPostSchema } from '../schemas/social-post.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SocialPost.name, schema: SocialPostSchema },
        ]),
    ],
    controllers: [SocialPostController],
    providers: [SocialPostService],
    exports: [SocialPostService],
})
export class SocialPostModule {}

