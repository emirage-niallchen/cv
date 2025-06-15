import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const auth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET || "";
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch {
    return null;
  }
}; 