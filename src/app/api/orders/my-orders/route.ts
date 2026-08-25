import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import '@/models/Product';
import { sendSuccess, sendError } from '@/lib/response';
import { getCustomerFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    const orders = await Order.find({ customer: user.id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(orders, 'Personal order history retrieved');
  } catch (error: any) {
    return sendError(error, 500);
  }
}
