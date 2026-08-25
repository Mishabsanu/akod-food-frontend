import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import '@/models/Product';
import { sendSuccess, sendError } from '@/lib/response';
import { getCustomerFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    const order = await Order.findOne({
      _id: params.id,
      customer: user.id,
    }).populate('items.product').lean();

    if (!order) {
      return sendError('Order not found', 404);
    }

    return sendSuccess(order, 'Order details retrieved');
  } catch (error: any) {
    return sendError(error, 500);
  }
}
