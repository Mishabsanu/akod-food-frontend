import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Cart from '@/models/Cart';
import '@/models/Product';
import { sendSuccess, sendError } from '@/lib/response';
import { getCustomerFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    const { items } = await req.json();
    let cart = await Cart.findOne({ customer: user.id });

    if (!cart) {
      cart = new Cart({ customer: user.id, items });
    } else {
      cart.items = items;
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    return sendSuccess(updatedCart, 'Cart synchronized');
  } catch (error: any) {
    return sendError(error, 500);
  }
}
