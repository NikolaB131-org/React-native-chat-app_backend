import ApiError from '../../middlewares/error/ApiError';
import { hashPassword, verifyPassword } from '../../utils/password';
import { generateAccessToken } from '../../utils/token';
import User from './../user/user.model';

const register = async (username: string, password: string): Promise<string> => {
  const candidate = await User.findOne({ username });
  if (candidate) {
    throw ApiError.badRequest('A user with this username is already registered');
  }
  if (username.length < 3) {
    throw ApiError.badRequest('User name must contain at least 3 characters');
  }

  const saltWithHash = hashPassword(password);
  const user = await User.create({ username, saltWithHash });
  const accessToken = generateAccessToken({ userId: user.id });

  console.log(`Registered new user: ${username}`);
  return accessToken;
};

const login = async (username: string, password: string): Promise<string> => {
  const user = await User.findOne({ username });
  if (!user) {
    return await register(username, password);
  }
  if (!verifyPassword(password, user.saltWithHash)) {
    throw ApiError.badRequest('The username or password is incorrect');
  }

  const accessToken = generateAccessToken({ username });

  console.log(`User logged in: ${username}`);
  return accessToken;
};

export default {
  register,
  login,
};
