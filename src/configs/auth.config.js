import dotenv from "dotenv";
import path from "path";

const envFound = dotenv.config({ path: path.resolve("../.env") });
if (envFound.error) {
  const envFound2 = dotenv.config();
  if (envFound2.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
}

export default {
  secret: process.env.ACCESS_TOKEN_SECRET,
};
