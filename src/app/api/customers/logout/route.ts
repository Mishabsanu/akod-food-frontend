import { NextRequest } from 'next/server';
import { sendSuccess } from '@/lib/response';

export async function POST(req: NextRequest) {
  const response = sendSuccess(null, 'Logged out successfully');
  response.cookies.delete('akod_access_token');
  response.cookies.delete('akod_refresh_token');
  return response;
}
