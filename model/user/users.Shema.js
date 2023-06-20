const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    maxlength: 50,
    trim: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 100,
    required: true,
  },
  mobile: {
    type: String,
    maxlength: 10,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    default: "Student",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  RefreshJWT: {
    token: {
      type: String,
      maxlength: 500,
      default: "",
    },
    addedAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
});

// const storeuserRefreshJWT=(_id,token)=>{
//   return new Promise((resolve, reject)=>{
//    try{
//       UserSchema.findOneAndUpdate({_id},{$set:{"RefreshJWT.token":token,"RefreshJWT.addedAt":Date.now()},
//     },
//       {new:true}
//       ).then((result) => resolve(result)).catch((err) =>{
//         console.log(err);
//         reject(err);
//       });
//    }catch(error){
//      reject(error);
//    }
//   })
// };
// const User = mongoose.model("users", UserSchema);
// module.exports = User;
// module.exports={storeuserRefreshJWT}

module.exports = {
  UserSchema: mongoose.model("users", UserSchema),
};
