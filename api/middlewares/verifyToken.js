const jwt = require("jsonwebtoken");

const verifyToken = function (req, res, next) {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      throw new Error({
        auth: false,
        message: "[SUCCESS] Token Not Provided!!",
      });
    }

    jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
      if (err) {
        console.log(err);
        throw new Error({
          auth: false,
          message: "[ERROR] Failed to authenticate!!",
        });
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;
