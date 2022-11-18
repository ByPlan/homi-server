import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../db/models/index.js";
import config from "../configs/auth.config.js";

export default class AuthService {
  async signup(user) {
    const userRecord = await db.User.create({
      email: user.email,
      password: bcrypt.hashSync(user.password1, 8),
      name: user.name,
    });
    return userRecord;
  }

  async login(user) {
    const userRecord = await db.User.findOne({
      where: {
        email: user.email,
      },
    });
    if (!userRecord) {
      throw new Error("User not found!");
    } else {
      let passwordIsValid = bcrypt.compareSync(
        user.password,
        userRecord.password
      );
      if (!passwordIsValid) {
        throw new Error("Invalid password!");
      }
      let token = jwt.sign({ id: userRecord.id }, config.secret, {
        expiresIn: 60 * 60 * 24 * 50,
      });
      return { user: userRecord, accessToken: token };
    }
  }
}
