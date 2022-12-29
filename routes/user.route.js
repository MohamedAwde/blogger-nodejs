const {
  getAllUsers,
  signUp,
  signOut,
  signIn,
  getUser,
} = require("./../controllers/user.controller");
const router = require("express").Router();
const Joi = require("joi");
const Auth = require("../controllers/utils/Auth");

const validateSignInData = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(409).json({ message: error.details[0].message });
  } else {
    next();
  }
};

const validateSignUpData = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    avatar: Joi.string().required(),
    bio: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(409).json({ message: error.details[0].message });
  } else {
    next();
  }
};

router.route("/").get(getAllUsers);

router.route("/:id").get(Auth, getUser);

router.route("/sign/up").post(validateSignUpData, signUp);

router.route("/sign/in").post(validateSignInData, signIn);

router.route("/sign/out", signOut);

module.exports = router;

/*
const validateSignUpData = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send({ error: true, message: error.details[0].message });
  } else {
    next();
  }
};



const validateSignInData = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.send({ error: true, message: error.details[0].message });
  } else {
    next();
  }
};

router
  .route("/signup")
  .post(isLoggedIn, validateSignUpData, async (req, res) => {
    const hashed_password = await bcrypt.hash(req.body.password, 10);
    const hashed_body = { ...req.body, password: hashed_password, posts: [] };

    const new_user = new Users(hashed_body);
    new_user
      .save()
      .then((user) => {
        const token = jwt.sign(
          { email: req.body.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res
          .status(201)
          .cookie("token", token, {
            maxAge: 1000 * 60 * 60 * 60,
            secure: true,
            httpOnly: true,
          })
          .send(user);
      })
      .catch((error) => {
        console.log(error);
        if (error.code == "11000")
          res
            .status(400)
            .send({ error: true, message: "email already exists." });
        else
          res
            .status(500)
            .send({ error: true, message: "error while adding new user" });
      });
  });

router.route("/signin").post(validateSignInData, async (req, res) => {
  const user_password = req.body.password;
  const user_email = req.body.email;

  try {
    const user = await Users.findOne({ email: user_email })
      .populate({
        path: "polls",
        model: "Polls",
      })
      .exec();

    if (user === null)
      return res
        .status(404)
        .send({ error: true, message: "user is not found" });

    if (bcrypt.compare(user_password, user.password)) {
      const token = jwt.sign(
        { email: req.body.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res
        .cookie("token", token, {
          maxAge: 1000 * 60 * 60 * 60,
          secure: true,
          httpOnly: true,
        })
        .send(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: true, message: "error while logging in" });
  }
});

router.route("/info").get(async (req, res) => {
  if (req.cookies.token) {
    jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (err) {
          return res
            .status(401)
            .clearCookie("token")
            .send({ error: true, message: "jwt token expired." });
        } else {
          Users.findOne({ email: decoded.email }, (err, user) => {
            if (err) {
              res.status(500).send(err);
            } else {
              delete user._doc.posts;
              res.send(user);
            }
          });
        }
      }
    );
  } else res.send("you are not sigen in.");
});

router.route("/signout").get((req, res) => {
  res.status(200).clearCookie("token").json();
});
*/
