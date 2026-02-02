import { Controller, Post, Body, Req, UseGuards, Get, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateOrderDto, CreatePaymentDto, UpdatePaymentDto } from '../dto/payment.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @UseGuards(AuthGuard)
    @Post('record-transaction')
    async recordTransaction(@Body() createPaymentDto: CreatePaymentDto, @Req() req) {
        return this.paymentService.createTransactionRecord(createPaymentDto, req.user.id);
    }

    @Post('update-status')
    async updateStatus(@Body() updatePaymentDto: UpdatePaymentDto) {
        return this.paymentService.updateTransactionStatus(updatePaymentDto);
    }

    @UseGuards(AuthGuard)
    @Post('create-order')
    async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req) {
        return this.paymentService.createOrder(createOrderDto, req.user.id);
    }
    @UseGuards(AuthGuard)
    @Get()
    findAll(@Req() req) {
        return this.paymentService.findAll(req.user.id);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.paymentService.findOne(id);
    }
}
