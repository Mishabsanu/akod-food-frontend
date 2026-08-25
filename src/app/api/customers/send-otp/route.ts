import { NextRequest } from 'next/server';
import { sendSuccess, sendError } from '@/lib/response';
import { sendEmailOTP } from '@/lib/notifications';
import otpStore from '@/lib/otpStore';

export async function POST(req: NextRequest) {
  try {
    const { email, identity } = await req.json();
    const targetEmail = (email || identity || '').trim().toLowerCase();

    if (!targetEmail || !targetEmail.includes('@')) {
      return sendError('A valid email address is required', 400);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(targetEmail, { otp, expires: Date.now() + 10 * 60 * 1000 });

    console.log(`[Email OTP] Generated code ${otp} for ${targetEmail}`);
    await sendEmailOTP(targetEmail, otp);

    return sendSuccess(null, `Verification code sent to ${targetEmail}`);
  } catch (error: any) {
    return sendError(error, 500);
  }
}
