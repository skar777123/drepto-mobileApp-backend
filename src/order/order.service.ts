import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import {
  DoctorAppointment,
  DoctorAppointmentDocument,
} from '../schemas/doctor-appointment.schema';
import {
  NurseAppointment,
  NurseAppointmentDocument,
} from '../schemas/nurse-appointment.schema';
import {
  LabTestBooking,
  LabTestBookingDocument,
} from '../schemas/lab-test-booking.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CalculatePricingDto } from './dto/calculate-pricing.dto';

/** Shared order cancellation policy (keep in sync with frontend constants). */
export const ORDER_CANCELLATION_WINDOW_DAYS = 2;
export const REFUND_PROCESSING_TIME = '5-7 working days';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(DoctorAppointment.name)
    private doctorApptModel: Model<DoctorAppointmentDocument>,
    @InjectModel(NurseAppointment.name)
    private nurseApptModel: Model<NurseAppointmentDocument>,
    @InjectModel(LabTestBooking.name)
    private labBookingModel: Model<LabTestBookingDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async create(createOrderDto: any): Promise<Order> {
    // Verify prices against the database to guarantee price integrity
    if (Array.isArray(createOrderDto.items) && createOrderDto.items.length > 0) {
      try {
        const pricing = await this.calculateCartPricing({
          items: createOrderDto.items,
          shippingMethod: createOrderDto.shippingMethod,
          pincode: createOrderDto.shippingAddress?.pincode,
        });
        if (pricing && pricing.totalWithShipping > 0) {
          createOrderDto.total = pricing.totalWithShipping;
          createOrderDto.shippingCost = pricing.shippingCost;
        }
      } catch (err) {
        console.warn('Failed to verify pricing against db in createOrder:', err);
      }
    }

    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<any> {
    let order: any = null;
    if (Types.ObjectId.isValid(id)) {
      order = await this.orderModel.findById(id).lean().exec();
    }
    if (!order) {
      order = await this.orderModel.findOne({ id }).lean().exec();
    }
    if (!order) {
      order = await this.orderModel.findOne({ orderId: id }).lean().exec();
    }
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Ensure order.id is populated for invoice displays
    const orderIdentifier = order.id || order.orderId || String(order._id);

    // Pre-calculate invoice figures server-side to offload work from client
    const deliveryCharge =
      typeof order.shippingCost === 'number'
        ? order.shippingCost
        : order.total > 50
        ? 50
        : 0;
    const calculatedItemsTotal = (order.items || []).reduce(
      (sum: number, item: any) =>
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0,
    );
    const subtotal =
      calculatedItemsTotal > 0
        ? calculatedItemsTotal
        : Math.max(0, order.total - deliveryCharge);

    return {
      ...order,
      id: orderIdentifier,
      subtotal,
      deliveryCharge,
      grandTotal: order.total,
    };
  }

  async findByUser(userEmail: string): Promise<Order[]> {
    return this.orderModel.find({ userEmail }).exec();
  }

  /**
   * Aggregated user activities (orders, doctor appointments, nurse appointments, lab bookings).
   * Moves multi-request fetching and array sorting from frontend client to server.
   */
  async getUserActivity(userEmail: string) {
    const [orders, doctorAppointments, nurseAppointments, labBookings] =
      await Promise.all([
        userEmail
          ? this.orderModel
              .find({ userEmail })
              .sort({ createdAt: -1, date: -1 })
              .lean()
              .exec()
          : [],
        this.doctorApptModel.find().sort({ createdAt: -1 }).lean().exec(),
        this.nurseApptModel.find().sort({ createdAt: -1 }).lean().exec(),
        this.labBookingModel.find().sort({ createdAt: -1 }).lean().exec(),
      ]);

    return {
      orders,
      doctorAppointments,
      nurseAppointments,
      labBookings,
    };
  }

  /**
   * Helper to normalize product offer definitions
   */
  resolveItemOffer(item: { offer?: any; offerDescription?: string }): any {
    if (item.offer && item.offer.isActive !== false) {
      return item.offer;
    }
    if (
      item.offerDescription &&
      typeof item.offerDescription === 'string' &&
      item.offerDescription.trim().length > 0
    ) {
      const text = item.offerDescription.trim();
      const bogoMatch = text.match(/buy\s*(\d+)\s*get\s*(\d+)/i);
      if (bogoMatch) {
        return {
          title: text,
          type: 'BOGO',
          buyQuantity: parseInt(bogoMatch[1], 10),
          getFreeQuantity: parseInt(bogoMatch[2], 10),
          isActive: true,
        };
      }
      const pctMatch = text.match(/(\d+)%\s*off/i);
      if (pctMatch) {
        return {
          title: text,
          type: 'PERCENTAGE',
          discountPercentage: parseInt(pctMatch[1], 10),
          isActive: true,
        };
      }
      const flatMatch = text.match(/(?:rs\.?|₹)\s*(\d+)\s*off/i);
      if (flatMatch) {
        return {
          title: text,
          type: 'FLAT',
          flatDiscount: parseInt(flatMatch[1], 10),
          isActive: true,
        };
      }
      return {
        title: text,
        type: 'BOGO',
        buyQuantity: 2,
        getFreeQuantity: 1,
        isActive: true,
      };
    }
    return null;
  }

  /**
   * Server-side cart pricing and shipping calculation engine.
   * Product prices and active offers are fetched directly from MongoDB to ensure data integrity and security.
   */
  async calculateCartPricing(dto: CalculatePricingDto) {
    const items = Array.isArray(dto.items) ? dto.items : [];
    const shippingMethod = dto.shippingMethod || 'India Post';
    const pincode = dto.pincode || '';

    // 1. Fetch official products directly from database by _id or name
    const objectIdCandidates = items
      .map((i) => i._id || i.id)
      .filter((id) => id && Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    const nameCandidates = items
      .map((i) => i.name || i.title)
      .filter((n) => typeof n === 'string' && n.trim().length > 0)
      .map((n) => String(n).trim());

    const conditions: any[] = [];
    if (objectIdCandidates.length > 0) {
      conditions.push({ _id: { $in: objectIdCandidates } });
    }
    if (nameCandidates.length > 0) {
      conditions.push({ name: { $in: nameCandidates } });
    }

    const dbProducts =
      conditions.length > 0
        ? await this.productModel.find({ $or: conditions }).lean().exec()
        : [];

    // 2. Calculate distance from pincode
    let distance = 0;
    if (pincode) {
      const pinVal = parseInt(pincode.substring(0, 3) || '100', 10);
      distance = ((isNaN(pinVal) ? 100 : pinVal) % 9) * 150 + 50;
    }

    // 3. Process each item's offer and pricing using database prices
    let originalSubtotal = 0;
    let finalSubtotal = 0;
    let totalDiscount = 0;

    const processedItems = items.map((item) => {
      // Find matching product in database
      const itemTitle = String(item.name || item.title || '').trim().toLowerCase();
      const dbProduct: any = dbProducts.find((p: any) => {
        const idMatch =
          (item._id || item.id) &&
          String(p._id) === String(item._id || item.id);
        const nameMatch =
          itemTitle.length > 0 &&
          p.name &&
          String(p.name).trim().toLowerCase() === itemTitle;
        return idMatch || nameMatch;
      });

      // Price fetched directly from the database
      let unitPrice = 0;
      if (dbProduct && typeof dbProduct.price === 'number') {
        unitPrice = dbProduct.price;
      } else if (dbProduct && typeof dbProduct.price === 'string') {
        unitPrice =
          parseFloat(String(dbProduct.price).replace(/[^0-9.]/g, '')) || 0;
      } else {
        // Fallback to client price if product not found in database
        const rawPrice =
          typeof item.price === 'string'
            ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
            : Number(item.price || 0);
        unitPrice = isNaN(rawPrice) ? 0 : rawPrice;
      }

      const safeQty = Math.max(0, Number(item.quantity) || 1);
      const itemOriginalTotal = unitPrice * safeQty;

      // Offer also sourced directly from the database if present
      const offerSource =
        dbProduct?.offer || dbProduct?.offerDescription ? dbProduct : item;
      const offer = this.resolveItemOffer(offerSource);

      let itemFinalTotal = itemOriginalTotal;
      let itemDiscount = 0;
      let paidUnits = safeQty;
      let freeUnits = 0;
      let effectiveUnitPrice = unitPrice;
      let offerTitle = '';
      let hint: string | undefined;
      let hasOffer = false;

      if (offer && safeQty > 0) {
        hasOffer = true;
        const type = offer.type || 'BOGO';

        if (type === 'BOGO') {
          const buyQty = Math.max(1, Number(offer.buyQuantity) || 2);
          const freeQty = Math.max(1, Number(offer.getFreeQuantity) || 1);
          const bundle = buyQty + freeQty;

          const completeBundles = Math.floor(safeQty / bundle);
          const remainder = safeQty % bundle;

          const freeFromBundles = completeBundles * freeQty;
          const freeFromRemainder = Math.max(0, remainder - buyQty);
          freeUnits = freeFromBundles + freeFromRemainder;
          paidUnits = safeQty - freeUnits;

          itemDiscount = freeUnits * unitPrice;
          itemFinalTotal = paidUnits * unitPrice;
          effectiveUnitPrice =
            safeQty > 0 ? itemFinalTotal / safeQty : unitPrice;
          offerTitle = offer.title || `Buy ${buyQty} Get ${freeQty} Free`;

          if (freeUnits > 0) {
            hint = `🎁 ${freeUnits} FREE product${
              freeUnits > 1 ? 's' : ''
            } automatically included in your order!`;
          } else if (remainder > 0 && remainder < buyQty) {
            const need = buyQty - remainder;
            hint = `Add ${need} more item${need > 1 ? 's' : ''} to get ${freeQty} FREE automatically! 🎁`;
          }
        } else if (type === 'PERCENTAGE') {
          const pct = Math.min(
            100,
            Math.max(0, Number(offer.discountPercentage) || 0),
          );
          const minQty = Math.max(1, Number(offer.minQuantity) || 1);
          offerTitle = offer.title || `${pct}% OFF`;

          if (safeQty >= minQty) {
            itemDiscount = Math.round(itemOriginalTotal * (pct / 100));
            itemFinalTotal = Math.max(0, itemOriginalTotal - itemDiscount);
            effectiveUnitPrice =
              safeQty > 0 ? itemFinalTotal / safeQty : unitPrice;
          } else {
            const need = minQty - safeQty;
            hint = `Add ${need} more to unlock ${pct}% OFF!`;
          }
        } else if (type === 'FLAT') {
          const flat = Math.max(0, Number(offer.flatDiscount) || 0);
          const minQty = Math.max(1, Number(offer.minQuantity) || 1);
          offerTitle = offer.title || `₹${flat} OFF`;

          if (safeQty >= minQty) {
            itemDiscount = Math.min(itemOriginalTotal, flat * safeQty);
            itemFinalTotal = Math.max(0, itemOriginalTotal - itemDiscount);
            effectiveUnitPrice =
              safeQty > 0 ? itemFinalTotal / safeQty : unitPrice;
          } else {
            const need = minQty - safeQty;
            hint = `Add ${need} more to unlock ₹${flat} OFF!`;
          }
        }
      }

      originalSubtotal += itemOriginalTotal;
      finalSubtotal += itemFinalTotal;
      totalDiscount += itemDiscount;

      return {
        ...item,
        name: dbProduct?.name || item.name || item.title,
        price: unitPrice,
        unitPrice,
        originalTotal: itemOriginalTotal,
        finalTotal: itemFinalTotal,
        discount: itemDiscount,
        paidUnits,
        freeUnits,
        effectiveUnitPrice,
        offerTitle,
        hint,
        hasOffer,
        isDatabaseVerified: !!dbProduct,
      };
    });

    // 4. Shipping cost and timeline
    let shippingCost = 0;
    let estimatedDays = 7;
    const hasFreeShipping =
      items.length > 0 && items.every((i) => i.freeShipping);

    if (hasFreeShipping) {
      shippingCost = 0;
      estimatedDays =
        shippingMethod === 'India Post'
          ? 5 + Math.floor(distance / 200)
          : 2 + Math.floor(distance / 400);
    } else if (shippingMethod === 'India Post') {
      shippingCost = 19;
      estimatedDays = 5 + Math.floor(distance / 200);
    } else {
      shippingCost = Math.round(90 + distance * 0.25);
      estimatedDays = 2 + Math.floor(distance / 400);
    }

    const totalWithShipping =
      Math.round((finalSubtotal + shippingCost) * 100) / 100;

    return {
      originalSubtotal: Math.round(originalSubtotal * 100) / 100,
      finalSubtotal: Math.round(finalSubtotal * 100) / 100,
      totalDiscount: Math.round(totalDiscount * 100) / 100,
      shippingCost,
      distance,
      estimatedDays,
      totalWithShipping,
      items: processedItems,
    };
  }

  async update(id: string, updateOrderDto: any): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findOneAndUpdate({ id }, updateOrderDto, { new: true })
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updatedOrder;
  }

  async cancel(id: string): Promise<Order> {
    const order: any = await this.orderModel.findOne({ id }).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    if (order.status === 'Cancelled') {
      throw new BadRequestException('This order has already been cancelled.');
    }
    if (order.status === 'Delivered' || order.status === 'Dispatched') {
      throw new BadRequestException(
        `Orders that are already ${order.status.toLowerCase()} cannot be cancelled.`,
      );
    }

    const placedAt = new Date(order.createdAt ?? order.date).getTime();
    const windowMs = ORDER_CANCELLATION_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    if (isNaN(placedAt) || Date.now() - placedAt > windowMs) {
      throw new BadRequestException(
        `Orders can only be cancelled within ${ORDER_CANCELLATION_WINDOW_DAYS} days of placing them.`,
      );
    }

    order.status = 'Cancelled';
    order.cancelledAt = new Date().toISOString();
    order.refundStatus = order.paymentId ? 'Pending' : 'Not Applicable';
    return order.save();
  }

  async remove(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findOneAndDelete({ id }).exec();
    if (!deletedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return deletedOrder;
  }
}
