const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RefreshJWTSchema = new Schema({
  refreshpin: {
    type: String,
    require: true,
  },
  objectid: {
    type: String,
    require: true,
  },
});
module.exports = {
  RefreshJWTSchema: mongoose.model("Refresh_JWT", RefreshJWTSchema),
};
