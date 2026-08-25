import { NextRequest } from 'next/server';
import { sendSuccess, sendError } from '@/lib/response';
import otpStore from '@/lib/otpStore';

export async function POST(req: NextRequest) {
  try {
    const { email, identity, otp } = await req.json();
    const targetEmail = (email || identity || '').trim().toLowerCase();

    if (!targetEmail || !otp) {
      return sendError('Email and OTP code are required', 400);
    }

    const stored = otpStore.get(targetEmail);
    if (!stored || stored.otp !== otp.toString().trim() || stored.expires < Date.now()) {
      return sendError('Invalid or expired OTP code', 400);
    }

    return sendSuccess({ verified: true }, 'Email verified successfully');
  } catch (error: any) {
    return sendError(error, 500);
  }
}
