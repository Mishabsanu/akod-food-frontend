// Global OTP store across Next.js dev server reloads
interface OTPRecord {
  otp: string;
  expires: number;
}

declare global {
  var globalOtpStore: Map<string, OTPRecord> | undefined;
}

const otpStore: Map<string, OTPRecord> =
  global.globalOtpStore || new Map<string, OTPRecord>();

if (!global.globalOtpStore) {
  global.globalOtpStore = otpStore;
}

export default otpStore;
