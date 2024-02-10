import { MongoClient } from "mongodb";

const connectionString =
  "mongodb+srv://kyoukung:vxsPuE6OXDCAic24@cluster0.t8v4l0a.mongodb.net/";

export const client = new MongoClient(connectionString);

export const db = client.db("practice-mongo");
