import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import { sendSuccess, sendError } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const [data, total] = await Promise.all([
      Category.find(query).skip(skip).limit(limit).lean(),
      Category.countDocuments(query),
    ]);

    return sendSuccess({ data, total, page, pages: Math.ceil(total / limit) }, 'Classification ledger retrieved');
  } catch (error: any) {
    return sendError(error, 500);
  }
}
