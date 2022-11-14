import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import path from "path";

const app = express();
const server = http.createServer(app);

const envFound = dotenv.config({ path: path.resolve("../.env") });
if (envFound.error) {
  const envFound2 = dotenv.config();
  if (envFound2.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
}

const PORT = process.env.PORT || 8000;
const API_HOST = process.env.API_HOST || "http://localhost";
let corsOptions = {
  origin: API_HOST + ":" + PORT,
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.json());

// root
app.get("/", (req, res) => {
  res.json({ message: "Welcome to planby application." });
});

await db.sequelize.authenticate();

// routes

// development mode
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync DB");
// });

// db.sequelize.sync();

// listen for requests
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
