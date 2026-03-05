import mongoose from 'mongoose';

const rawMongoUri = process.env.MONGODB_URI;
const MONGODB_URI = rawMongoUri?.trim().replace(/^['"]|['"]$/g, '');

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI. Create a .env at the project root and set MONGODB_URI=...');
}

if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
  const masked = MONGODB_URI.replace(/\/\/([^:@/]+):([^@/]+)@/, '//***:***@');
  throw new Error(`Invalid MONGODB_URI scheme. Expected "mongodb://" or "mongodb+srv://". Got: ${masked}`);
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
