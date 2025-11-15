import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './mongo/mongo.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/drepto',
    ),
    MongoModule,
    
    CacheModule.register({
      isGlobal: true,
      ttl: 120 * 10000,
      store: redisStore,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
