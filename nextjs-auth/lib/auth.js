import { hash } from "bcryptjs";

export async function hashMyPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}
