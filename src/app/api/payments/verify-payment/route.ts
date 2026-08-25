import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { sendSuccess, sendError } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return sendError('Razorpay secret not configured', 500);
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (order) {
        order.paymentStatus = 'paid';
        order.status = 'processing';
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();
      }
      return sendSuccess({ verified: true }, 'Payment verified successfully');
    } else {
      return sendError('Payment verification failed', 400);
    }
  } catch (error: any) {
    return sendError(error, 500);
  }
}
