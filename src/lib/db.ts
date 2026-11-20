import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.DB_NAME || "fixmate";

const g = globalThis as unknown as { _fmMongo?: MongoClient };
export const mongoClient = g._fmMongo ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") g._fmMongo = mongoClient;

export const db = mongoClient.db(dbName);
