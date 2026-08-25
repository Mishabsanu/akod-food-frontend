import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import '@/models/Category';
import { sendSuccess, sendError } from '@/lib/response';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).populate('category').lean();
    if (!product) {
      return sendError('Product not found', 404);
    }
    return sendSuccess(product, 'Product details established');
  } catch (error: any) {
    return sendError(error, 500);
  }
}
