import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { sendSuccess, sendError } from '@/lib/response';
import { getCustomerFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    const order = await Order.findOne({ _id: params.id, customer: user.id });
    if (!order) return sendError('Order not found', 404);

    if (order.status !== 'pending' && order.status !== 'processing') {
      return sendError('Order cannot be cancelled in its current state', 400);
    }

    order.status = 'cancelled';
    await order.save();

    return sendSuccess(order, 'Order cancelled by customer');
  } catch (error: any) {
    return sendError(error, 500);
  }
}
