import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Customer from '@/models/Customer';
import { sendSuccess, sendError } from '@/lib/response';
import { getCustomerFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    const customer = await Customer.findById(user.id).select('-password -refreshToken');
    if (!customer) return sendError('Profile not found', 404);

    return sendSuccess(customer, 'Profile retrieved');
  } catch (error: any) {
    return sendError(error, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    const { firstName, lastName, phone } = await req.json();
    const customer = await Customer.findById(user.id);
    if (!customer) return sendError('Profile not found', 404);

    if (firstName) customer.firstName = firstName;
    if (lastName) customer.lastName = lastName;
    if (firstName || lastName) {
      customer.name = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
    }
    if (phone) customer.phone = phone;

    await customer.save();
    return sendSuccess(customer, 'Profile updated successfully');
  } catch (error: any) {
    return sendError(error, 500);
  }
}
