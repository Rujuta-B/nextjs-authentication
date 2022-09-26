import MongoClient from "mongodb";

export function connectToDatabase(req, res) {
  const client = MongoClient.connect(
    "mongodb+srv://rujutab:k4TpmtgPu6N6HdBr@cluster0.ewr6ikd.mongodb.net/users?retryWrites=true&w=majority"
  );
  return client;
}
