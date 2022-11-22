import dotenv from "dotenv";
import path from "path";
import { S3Client } from "@aws-sdk/client-s3";

const envFound = dotenv.config({ path: path.resolve("../.env") });
if (envFound.error) {
  const envFound2 = dotenv.config();
  if (envFound2.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
}

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export { s3 };
