import emailValidator from "email-validator";
import passwordValidator from "password-validator";
import db from "../../db/models/index.js";

const schema = new passwordValidator();
schema
  .is()
  .min(8)
  .is()
  .max(32)
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces();

const checkValidEmail = (req, res, next) => {
  const User = db.User;
  console.log(User);
  if (!req.body.email) {
    return res.status(400).send({ message: "Email is not provided" });
  } else if (!emailValidator.validate(req.body.email)) {
    return res.status(409).send({ message: "Email format is not valid" });
  }
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      return res.status(400).send({
        message: "Failed! Email is already in use!",
      });
    }
    next();
  });
};

const checkValidPassword = (req, res, next) => {
  if (!req.body.password1 || !req.body.password2) {
    return res.status(400).json({ message: "Password is not provided" });
  } else if (req.body.password1 !== req.body.password2) {
    return res.status(409).json({ message: "Password does not match" });
  } else if (!schema.validate(req.body.password1)) {
    return res.status(409).json({ message: "Password format is not valid" });
  }
  next();
};

// const checkRolesExisted = (req, res, next) => {
//   if (req.body.roles) {
//     for (let i = 0; i < req.body.roles.length; i++) {
//       if (!ROLES.includes(req.body.roles[i])) {
//         return res.status(400).send({
//           message: "Failed! Role does not exist = " + req.body.roles[i],
//         });
//       }
//     }
//   }
//   next();
// };

const verifySignUp = {
  checkValidEmail: checkValidEmail,
  checkValidPassword: checkValidPassword,
  // checkRolesExisted: checkRolesExisted,
};

export default verifySignUp;
