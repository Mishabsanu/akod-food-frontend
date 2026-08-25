import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Customer from '@/models/Customer';
import { sendSuccess, sendError } from '@/lib/response';
import { getCustomerFromRequest } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { addressId: string } }) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    const customer = await Customer.findById(user.id);
    if (!customer) return sendError('Customer not found', 404);

    customer.addresses.forEach((addr: any) => {
      addr.isDefault = addr._id.toString() === params.addressId;
    });

    await customer.save();
    return sendSuccess(customer.addresses, 'Primary logistics node updated');
  } catch (error: any) {
    return sendError(error, 500);
  }
}
