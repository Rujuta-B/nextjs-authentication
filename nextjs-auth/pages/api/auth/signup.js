//the goal of this file is to store the incoming email & password of the user by connecting to the database, also validating the incoming email & password...

import { hashMyPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const data = req.body;

  const { email, password } = data;

  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message:
        "Invalid input - password should also be at least 7 characters long.",
    });
    return;
  }

  const client = await connectToDatabase();
  const db = client.db();

  //check for existing user
  const existingUser = await db.collection("users").findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: "User already exists" });
    client.close();
  }

  const hashedPassword = await hashMyPassword(password);
  const result = await db
    .collection("users")
    .insertOne({ email: email, password: hashedPassword });

  res.status(201).json({ message: "Created User!" });
  client.close();
}

export default handler;
