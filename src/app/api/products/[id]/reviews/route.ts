import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Customer from '@/models/Customer';
import { sendSuccess, sendError } from '@/lib/response';
import { getCustomerFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).lean();
    if (!product) return sendError('Product not found', 404);

    return sendSuccess(product.reviews || [], 'Reviews retrieved');
  } catch (error: any) {
    return sendError(error, 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    const { rating, comment } = await req.json();
    const customer = await Customer.findById(user.id);
    const customerName = customer ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() : 'Valued Client';

    const product = await Product.findById(params.id);
    if (!product) return sendError('Product not found', 404);

    const newReview = {
      customer: customer ? (customer._id as any) : undefined,
      customerName,
      rating: Number(rating),
      comment,
      isVerified: true,
    };

    product.reviews.push(newReview);
    product.reviewsCount = product.reviews.length;
    const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();
    return sendSuccess(product.reviews, 'Review documented', 201);
  } catch (error: any) {
    return sendError(error, 500);
  }
}
