import ApiError from '../../middlewares/error/ApiError';
import User from './../user/user.model';

const register = async (username: string): Promise<string | void> => {
  if (username.length < 3) {
    throw ApiError.badRequest('User name must contain at least 3 characters');
  }
  const user = await User.create({ username });
  console.log(`Registered new user: ${username}`);
  return user.id;
};

const login = async (username: string): Promise<string | void> => {
  const user = await User.findOne({ username });
  if (user) {
    console.log(`User logged in: ${username}`);
    return user.id;
  } else {
    return await register(username);
  }
};

export default {
  login,
};
