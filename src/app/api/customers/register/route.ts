import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Customer from '@/models/Customer';
import { sendSuccess, sendError } from '@/lib/response';
import { generateCustomerTokens } from '@/lib/auth';
import otpStore from '@/lib/otpStore';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { firstName, lastName, email, phone, otp } = await req.json();
    const targetEmail = (email || '').trim().toLowerCase();

    if (!targetEmail || !otp) {
      return sendError('Email and OTP verification code are required', 400);
    }

    const stored = otpStore.get(targetEmail);
    const isVerified = !!(stored && stored.otp === otp.toString().trim());

    if (!isVerified) {
      return sendError('Invalid or expired OTP verification code', 400);
    }

    let customer = await Customer.findOne({ email: targetEmail });
    if (customer) {
      return sendError('User already exists with this email', 400);
    }

    customer = new Customer({
      firstName,
      lastName,
      name: `${firstName || ''} ${lastName || ''}`.trim() || 'Valued Client',
      email: targetEmail,
      phone: phone || '',
      status: 'Active',
    });

    const { accessToken, refreshToken } = generateCustomerTokens(customer._id);
    customer.refreshToken = refreshToken;
    await customer.save();
    otpStore.delete(targetEmail);

    const response = sendSuccess({
      accessToken,
      customer: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      }
    }, 'Account created successfully', 201);

    response.cookies.set('akod_access_token', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1 * 60 * 60,
      path: '/',
    });

    response.cookies.set('akod_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return sendError(error, 500);
  }
}
