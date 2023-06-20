const {RefreshJWTSchema} = require("./refresh.Schema");


const settokenJWT = (tokenandid) => {
  return new Promise((resolve, reject) => {
    RefreshJWTSchema(tokenandid)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const gettokenJWT = (refreshpin) => {
  return new Promise((resolve, reject) => {
    if (!refreshpin) return false;
    RefreshJWTSchema.findOne({ refreshpin })
      .then((data) => resolve(data?.objectid))
      .catch((error) => reject(error));
  });
};

const deletetokenJWT = (refreshpin) => {
  return new Promise((resolve, reject) => {
    if (!refreshpin) return false;
    RefreshJWTSchema.findOneAndDelete({ refreshpin })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

module.exports = {
    settokenJWT,
    gettokenJWT,
    deletetokenJWT
};