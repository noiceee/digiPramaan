const jwt = require("jsonwebtoken");

const verifyToken = function (req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(403)
      .send({ auth: false, message: "Token Not Provided!!" });
  }

  jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
    if (err) {
      console.log(err);
      return res.status(500).send({
        auth: false,
        message: "Failed to authenticate!!",
      });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
