const userrouter = require("express").Router();
const {
  getallusers,
  isEmailexist,
  insertUser,
  getUserByEmail,
  getUserById,
  updatePassword,
  storeUserRefreshJWT,
  Edituserprofile
} = require("../model/user/users.model");
const {
  setPasswordRestPin,
  getPinByEmailPin,
  deletePin,
} = require("../model/resetpin/ResetPin.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const genPassword = require("../services/hashedpassword");
const { ceateAccessJWT, ceateRefreahJWT } = require("../services/Jwt.helper");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");
const { emailProcessor } = require("../services/email.helper");
const {
  resetPassReqValidation,
  updatePassValidation,
} = require("../middlewares/formValidation");
const {deletetokenJWT}=require("../model/refreshjwt/refresh.model");
const { isValidObjectId } = require("mongoose");

//routes checking
// userrouter.all("/", (req, res, next) => {
//   //  console.log(name);
//   //  response.json({message:"return from user router"});
//   next();
// });

// Get user profile
userrouter.get("/", userAuthorization, async (req, res, next) => {
  //this data coming form database
  const _id = req.userId;
  const userProfile = await getUserById(_id);
  // const { name, email } = userProf;
  res.json({ user: userProfile });
});

//get all users
userrouter.get("/allusers", async (req, res, next) => {
  try {
    const response = await getallusers();
    if (response.length > 0) {
      return res.status(200).send(response);
    } else {
      return res.status(500).json({
        success: false,
        message: "Users not found!!!",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error,
      message: "Internal server error!!!",
    });
  }
});

//create new user
userrouter.post("/newuser", async function (req, res, next) {
  const { firstname, lastname, email, password, mobile, role, isActive } =
    req.body;
  const isUserExist = await isEmailexist(email);
  // console.log(isUserExist._id);
  if (isUserExist) {
    res.status(404).send({
      status: "failed",
      message: "Email id already Exist cannot sign in with the same Email id",
    });
    return;
  }
  if (!/^(?=.*?[0-9])(?=.*?[a-z]).{8,}$/g.test(password)) {
    res.status(400).send({ message: "Password pattern doesn't match" });
    return;
  }
  try {
    const hashedPassword = await genPassword(password);
    const newUserObj = {
      firstname,
      lastname,
      email,
      password: hashedPassword,
      mobile,
      role,
      isActive,
    };
    const result = await insertUser(newUserObj);
    console.log(result);
    if (result?._id) {
      return res.status(200).json({
        status: "success",
        success: true,
        message: "User Created Successfully!!!",
        data: result,
      });
    } else {
      return res.status(500).json({
        status: "error",
        success: false,
        message: "User Creation failed!!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      success: false,
      message: "Bad request!!!",
      error: error.message,
    });
  }
});

//Get user by Logg In
userrouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Form Submission" });
    }
    const user = await getUserByEmail(email);
    // console.log(user);
    if (!user) {
      return res
        .status(400)
        .send({ status: "error", message: "Account doesnot exists!!!!" });
    }
    const storedDbPassword = user.password;
    const isPasswordMatch = await bcrypt.compare(password, storedDbPassword);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .send({status: "error", message: "Password Doesn't Match, Login Failed!!!!" });
    }
    const accessJWT = await ceateAccessJWT(user.email, `${user._id}`);
    const RefreshJWT = await ceateRefreahJWT(user.email, `${user._id}`);
    res.send({
      status: "success",
      message: "Logged In Successfull",
      data: user,
      accessJWT,
      RefreshJWT,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Login Credentials missing",
      error: error.message,
    });
  }
});

//Reset-Password,verification
userrouter.post("/reset-password", resetPassReqValidation, async (req, res) => {
  // resetPassReqValidation,
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (user && user._id) {
    /// create// 2. create unique 6 digit pin
    const setPin = await setPasswordRestPin(email);
    await emailProcessor({
      email,
      pin: setPin.pin,
      type: "request-new-Password",
    });
    return res.json({
      status: "success",
      message:
        "If the email id exist, the password reset pin will be sent to your Email id.",
    });
  }
  res.json({
    status: "Failure",
    message:
      "If the email id exist, the password reset pin will be sent to your Email id.",
  });
});

userrouter.patch("/reset-password",  async (req, res) => {
  const { email, pin, newPassword } = req.body;
  const getpin = await getPinByEmailPin(email, pin);
  if (getpin?._id) {
    const dbdate = getpin.addedAt;
    const expiresin = 0.5;
    let exptime = dbdate.setTime(dbdate.getTime() + expiresin * 60 * 60 * 1000);
    const currenttime = new Date();
    if (currenttime > exptime) {
      return res.json({ status: "error", message: "Invalid or PIN Expired" });
    }
    //Encrypt the new password
    const hashedPassword = await genPassword(newPassword);
    const user = await updatePassword(email, hashedPassword);
    if (user._id) {
      await emailProcessor({ email, type: "Password-update-success" });
      deletePin(email, pin);
      return res.json({
        status: "sucess",
        message: "Your Password has been Updated Successfully",
      });
    }
  }
  res.json({
    status: "error",
    message: "Unable to update your password please try again later",
  });
});

// User logout and invalidate jwts

userrouter.delete("/logout", userAuthorization, async (req, res) => {
	const { authorization } = req.headers;
	//this data coming form database
	const _id = req.userId;
	// 2. delete accessJWT from redis database
	deletetokenJWT(authorization);
	// 3. delete refreshJWT from mongodb
	const result = await storeUserRefreshJWT(_id, "");
	if (result._id) {
		return res.json({ status: "success", message: "Loged out successfully" });
	}
	res.json({
		status: "error",
		message: "Unable to logg you out, plz try again later",
	});
});

// Edit Profile by Id
userrouter.put("/editprofile",userAuthorization, async function (req, res, next) {
    const editid = req.userId;
    const update = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      mobile: req.body.mobile,
    };
    console.log(editid,update);
   const result= await Edituserprofile(editid,update);
   if (result._id) {
    return res.json({
      status: "success",
      message: "User details updated successfully",
    });
  }
  res.json({
    status: "error",
    message: "Unable to update the ticket",
  });
});



module.exports = userrouter;
