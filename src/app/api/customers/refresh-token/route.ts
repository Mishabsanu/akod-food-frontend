import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Customer from '@/models/Customer';
import { sendSuccess, sendError } from '@/lib/response';
import { generateCustomerTokens } from '@/lib/auth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'akod_super_secret_jwt_key_2026';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get('akod_refresh_token')?.value;

    if (!token) {
      return sendError('No refresh token provided', 401);
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return sendError('Invalid or expired refresh token', 401);
    }

    const customer = await Customer.findById(decoded.id);
    if (!customer || customer.refreshToken !== token) {
      return sendError('Invalid refresh token', 401);
    }

    const tokens = generateCustomerTokens(customer._id);
    customer.refreshToken = tokens.refreshToken;
    await customer.save();

    const response = sendSuccess({ accessToken: tokens.accessToken }, 'Token refreshed successfully');

    response.cookies.set('akod_access_token', tokens.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1 * 60 * 60,
      path: '/',
    });

    response.cookies.set('akod_refresh_token', tokens.refreshToken, {
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
