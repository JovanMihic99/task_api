import bcrypt from "bcrypt";

const removePropertyFromObject = (object: any, prop: string) => {
  const { [prop]: _, ...rest } = object;
  return rest;
};

const checkPassword = async (user: any, password: string): Promise<boolean> => {
  if (!user) {
    return false;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return false;
  }
  return true;
};

export default {
  removePropertyFromObject,
  checkPassword,
};
