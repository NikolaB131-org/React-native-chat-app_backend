import crypto from 'crypto';

export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, Number(process.env.PASSWORD_HASH_LENGTH)).toString('hex');
  return salt + ':' + hash;
};

export const verifyPassword = (password: string, saltWithHash: string): boolean => {
  const [salt, hash] = saltWithHash.split(':');
  const oldHashBuffer = Buffer.from(hash, 'hex');
  const newHashBuffer = crypto.scryptSync(password, salt, Number(process.env.PASSWORD_HASH_LENGTH));
  return crypto.timingSafeEqual(oldHashBuffer, newHashBuffer);
};
