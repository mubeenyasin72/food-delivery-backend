import bcrypt from "bcrypt";

export const GenerateSalt = async () => {
  return await bcrypt.genSalt(10);
};
export const EncryptPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ComparePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
    return await EncryptPassword(enteredPassword, salt) === savedPassword
};
