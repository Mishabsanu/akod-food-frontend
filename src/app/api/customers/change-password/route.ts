import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Customer from '@/models/Customer';
import { sendSuccess, sendError } from '@/lib/response';
import { getCustomerFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    const { oldPassword, newPassword } = await req.json();
    const customer = await Customer.findById(user.id);
    if (!customer) return sendError('Customer not found', 404);

    const isMatch = await customer.comparePassword(oldPassword);
    if (!isMatch) return sendError('Current security key is incorrect', 400);

    customer.password = newPassword;
    await customer.save();

    return sendSuccess(null, 'Password changed successfully');
  } catch (error: any) {
    return sendError(error, 500);
  }
}
