import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../lib/db";
import { hashMyPassword, verifyPassword } from "../../lib/auth";

async function handler(req, res) {
  if (req.mehtod !== "PATCH") {
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();

  const usersCollection = client.db().collection("users");

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const passwordsAreEqual = verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEqual) {
    res.status(403).json("New password should not match the old one");
    client.close();
    return;
  }

  const hashedPassword = await hashMyPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );

  client.close();

  res.status(200).json({ message: "Password updated" });
}
