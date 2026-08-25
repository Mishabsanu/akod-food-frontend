import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'akod_super_secret_jwt_key_2026';

export interface TokenUser {
  id: string;
}

export function generateCustomerTokens(customerId: string | object) {
  const idStr = customerId.toString();
  const accessToken = jwt.sign({ id: idStr }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: idStr }, JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

export function verifyToken(token: string): TokenUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenUser;
  } catch (error) {
    return null;
  }
}

export function getCustomerFromRequest(req: NextRequest): TokenUser | null {
  const authHeader = req.headers.get('Authorization');
  let token = authHeader?.replace(/^Bearer\s+/i, '');

  if (!token) {
    token = req.cookies.get('akod_access_token')?.value;
  }

  if (!token) {
    token = req.cookies.get('akodUserToken')?.value;
  }

  if (!token) return null;
  return verifyToken(token);
}
