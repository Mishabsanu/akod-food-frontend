import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Customer from '@/models/Customer';
import { sendSuccess, sendError } from '@/lib/response';
import { getCustomerFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    const { type, street, city, state, zipCode, country, isDefault } = await req.json();
    const customer = await Customer.findById(user.id);
    if (!customer) return sendError('Customer not found', 404);

    if (isDefault) {
      customer.addresses.forEach((addr: any) => { addr.isDefault = false; });
    }

    customer.addresses.push({ type, street, city, state, zipCode, country, isDefault });
    await customer.save();

    return sendSuccess(customer.addresses, 'Logistics node added successfully');
  } catch (error: any) {
    return sendError(error, 500);
  }
}
