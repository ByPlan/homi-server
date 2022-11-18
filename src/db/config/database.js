import dotenv from "dotenv";
import path from "path";

const envFound = dotenv.config({ path: path.resolve("../.env") });
if (envFound.error) {
  const envFound2 = dotenv.config();
  if (envFound2.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
}

const development = {
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE_DEVELOPMENT,
  host: process.env.MYSQL_HOST,
  dialect: process.env.MYSQL_DIALECT,
  timezone: process.env.MYSQL_TIMEZONE,
};
const test = {
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE_TEST,
  host: process.env.MYSQL_HOST,
  dialect: process.env.MYSQL_DIALECT,
  timezone: process.env.MYSQL_TIMEZONE,
};
const production = {
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE_PRODUCTION,
  host: process.env.MYSQL_HOST,
  dialect: process.env.MYSQL_DIALECT,
  timezone: process.env.MYSQL_TIMEZONE,
};

const database = {
  development: development,
  test: test,
  production: production,
};

export default database;
