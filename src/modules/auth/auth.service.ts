import User from './../user/user.model';

const register = async (username: string) => {
  await User.create({ username });
  console.log(`Registered new user: ${username}`);
};

const login = async (username: string) => {
  const user = await User.exists({ username });
  if (!user) await register(username);
  console.log(`User logged in: ${username}`);
};

export default {
  login,
};
