const express = require("express");
const tokenRouter = express.Router();
const { verifyRefreshJWT, ceateAccessJWT } = require("../services/Jwt.helper");
const { getUserByEmail } = require("../model/user/users.model");

//return refresh jwt
tokenRouter.get("/", async (req, res, next) => {
  const { authorization } = req.headers;

  const decoded = await verifyRefreshJWT(authorization);
  if (decoded.email) {
    const userProf = await getUserByEmail(decoded.email);
    if (userProf._id) {
      let tokenExp = userProf.RefreshJWT.addedAt;
       const dBrefreshToken = userProf.RefreshJWT.token;
      tokenExp = tokenExp.setDate(
        tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
      );
      const today = new Date();
      if (dBrefreshToken !== authorization && tokenExp < today) {
        return res
          .status(403)
          .json({ message: "Forbidden!, Need to Sign in again" });
      }
      const accessJWT = await ceateAccessJWT(
        decoded.email,
        userProf._id.toString()
      );
      return res.json({ status: "Success", accessJWT });
    }
  }
  res.status(403).json({ message: "Forbidden" });
});

module.exports = tokenRouter;
