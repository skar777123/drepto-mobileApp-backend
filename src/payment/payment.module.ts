import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment, PaymentSchema } from '../schemas/payment.schema';
import { AuthModule } from '../auth/auth.module';
import { ShippingAddressModule } from '../shipping-address/shipping-address.module';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Payment.name, schema: PaymentSchema },
            { name: User.name, schema: UserSchema },
        ]),
        AuthModule,
        ShippingAddressModule,
    ],
    controllers: [PaymentController],
    providers: [PaymentService],
})
export class PaymentModule { }
