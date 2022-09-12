import { Db, MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.DB_NAME;

if (!MONGODB_URI) {
  throw new Error("Define the MONGODB_URI environmental variable");
}

if (!MONGODB_DB) {
  throw new Error("Define the MONGODB_DB environmental variable");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  // check the cached.
  if (cachedClient && cachedDb) {
    // load from cache
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  const opts: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  let client: MongoClient = new MongoClient(MONGODB_URI, opts);
  await client.connect();
  let db: Db = client.db(MONGODB_DB);

  // set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}

export interface ConnectionType {
  client: MongoClient;
  db: Db;
}