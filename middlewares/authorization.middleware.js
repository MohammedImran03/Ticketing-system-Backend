const { verifyAccessJWT } = require("../services/Jwt.helper");
const {gettokenJWT,deletetokenJWT}=require("../model/refreshjwt/refresh.model");
const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;
  // console.log(authorization);
  const decoded = await verifyAccessJWT(authorization);
  if (decoded.email) {
    const userId = await gettokenJWT(authorization);
    if (!userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.userId = userId;
    return next();
  }
  deletetokenJWT(authorization);
  return res.status(403).json({ message: "Forbidden" });
};

module.exports = {
  userAuthorization,
};
