import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Cart from '@/models/Cart';
import '@/models/Product';
import { sendSuccess, sendError } from '@/lib/response';
import { getCustomerFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    let cart = await Cart.findOne({ customer: user.id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ customer: user.id, items: [] });
    }

    return sendSuccess(cart, 'Cart retrieved');
  } catch (error: any) {
    return sendError(error, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    const cart = await Cart.findOne({ customer: user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return sendSuccess(null, 'Cart cleared');
  } catch (error: any) {
    return sendError(error, 500);
  }
}
