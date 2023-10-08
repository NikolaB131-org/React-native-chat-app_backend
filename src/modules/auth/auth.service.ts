import User from './../user/user.model';

const register = async (username: string): Promise<string> => {
  const user = await User.create({ username });
  console.log(`Registered new user: ${username}`);
  return user._id.toString();
};

const login = async (username: string): Promise<string> => {
  const user = await User.findOne({ username });
  console.log(`User logged in: ${username}`);
  if (!user) return await register(username);
  return user._id.toString();
};

export default {
  login,
};
