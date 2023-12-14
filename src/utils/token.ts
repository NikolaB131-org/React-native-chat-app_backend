import jwt from 'jsonwebtoken';
import ApiError from '../middlewares/error/ApiError';

export const generateAccessToken = (obj: object): string => {
  const accessTokenSecret = process.env.JWT_ACCESS_SECRET_KEY;
  if (!accessTokenSecret) throw ApiError.internal('Token generation failed');

  return jwt.sign(obj, accessTokenSecret);
};

export const verifyAccessToken = (accessToken: string): { userId: string } => {
  const accessTokenSecret = process.env.JWT_ACCESS_SECRET_KEY;
  if (!accessTokenSecret) throw new Error();

  return jwt.verify(accessToken, accessTokenSecret) as { userId: string };
};
