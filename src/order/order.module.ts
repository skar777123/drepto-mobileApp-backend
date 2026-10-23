import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from '../schemas/order.schema';
import {
  DoctorAppointment,
  DoctorAppointmentSchema,
} from '../schemas/doctor-appointment.schema';
import {
  NurseAppointment,
  NurseAppointmentSchema,
} from '../schemas/nurse-appointment.schema';
import {
  LabTestBooking,
  LabTestBookingSchema,
} from '../schemas/lab-test-booking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: DoctorAppointment.name, schema: DoctorAppointmentSchema },
      { name: NurseAppointment.name, schema: NurseAppointmentSchema },
      { name: LabTestBooking.name, schema: LabTestBookingSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
