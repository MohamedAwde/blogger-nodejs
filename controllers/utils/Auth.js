var jwt = require("jsonwebtoken");

const Auth = (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: "you are not authenticated" });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (decoded) {
        req.body.userid = decoded;
        return next();
      }
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "you are not authenticated" });
      }
    });
  } catch (error) {
    return res.status(404).json({ message: "invaild token" });
  }
  next();
};

module.exports = Auth;
