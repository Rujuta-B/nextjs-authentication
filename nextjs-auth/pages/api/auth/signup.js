//the goal of this file is to store the incoming email & password of the user by connecting to the database, also validating the incoming email & password...

import { hashMyPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const data = req.body;

  //extracting data out of request's body
  const { email, password } = data;

  //validation of email & password
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

  //connection to database, accessing
  const client = await connectToDatabase();
  const db = client.db();

  //signup a new user
  const result = await db
    .collection("users")
    .insertOne({ email: email, password: hashedPassword });

  res.status(201).json({ message: "Created User!" }); //A REST API responds with the 201 status code whenever a resource is "created" inside a collection.
  client.close();

  //hash your password, otherwise it will be saved in plaintext
  const hashedPassword = await hashMyPassword(password);

  //check for existing user
  const existingUser = await db.collection("users").findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: "User already exists" });
    // 	CODE 422: The server understands the content type and syntax of the request entity, but still server is unable to process the request for some reason.
    client.close();
  }
}

export default handler;
