var jwt = require("jsonwebtoken");

const Auth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "you are not authenticated" });
  }
  try {
    jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (decoded) {
          console.log(decoded);
          req.body.userid = decoded;
          return next();
        }
        if (err) {
          console.log(err);
          return res
            .status(401)
            .clearCookie("token")
            .json({ message: "you are not authenticated" });
        }
      }
    );
  } catch (error) {
    res.status(404).clearCookie("token").json({ message: "invaild token" });
  }
  next();
};

module.exports = Auth;
