import { NextRequest } from 'next/server';
import Razorpay from 'razorpay';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { sendSuccess, sendError } from '@/lib/response';
import { getCustomerFromRequest } from '@/lib/auth';

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are missing in environment variables');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    const { amount, items, shippingAddress } = await req.json();

    if (!amount || !items || items.length === 0) {
      return sendError('Amount and items are required', 400);
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpay = getRazorpayInstance();
    const rzpOrder = await razorpay.orders.create(options);

    const orderItems = items.map((item: any) => {
      const product = item.product?._id || item.product;
      const price = item.variant?.sellingPrice || item.variant?.price || 0;
      return {
        product,
        quantity: item.quantity,
        price: Number(price),
      };
    });

    const order = new Order({
      customer: user.id,
      items: orderItems,
      totalAmount: Number(amount),
      shippingAddress: shippingAddress || 'No Address Provided',
      status: 'pending',
      paymentStatus: 'pending',
      razorpayOrderId: rzpOrder.id,
    });

    await order.save();

    return sendSuccess({
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      localOrderId: order._id,
      keyId: process.env.RAZORPAY_KEY_ID,
    }, 'Payment intent established');
  } catch (error: any) {
    return sendError(error, 500);
  }
}
