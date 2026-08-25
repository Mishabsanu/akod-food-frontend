import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Customer from '@/models/Customer';
import { sendSuccess, sendError } from '@/lib/response';
import { getCustomerFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { addressId: string } }) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    const { type, street, city, state, zipCode, country, isDefault } = await req.json();
    const customer = await Customer.findById(user.id);
    if (!customer) return sendError('Customer not found', 404);

    const address = (customer.addresses as any).id(params.addressId);
    if (!address) return sendError('Logistics node not found', 404);

    if (isDefault) {
      customer.addresses.forEach((addr: any) => { addr.isDefault = false; });
    }

    if (type) address.type = type;
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (zipCode) address.zipCode = zipCode;
    if (country) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await customer.save();
    return sendSuccess(customer.addresses, 'Logistics node updated successfully');
  } catch (error: any) {
    return sendError(error, 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { addressId: string } }) {
  try {
    await connectDB();
    const user = getCustomerFromRequest(req);
    if (!user) return sendError('Unauthorized', 401);

    const customer = await Customer.findById(user.id);
    if (!customer) return sendError('Customer not found', 404);

    (customer.addresses as any).pull(params.addressId);
    await customer.save();

    return sendSuccess(customer.addresses, 'Logistics node removed successfully');
  } catch (error: any) {
    return sendError(error, 500);
  }
}
