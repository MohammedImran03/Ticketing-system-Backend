const redis = require("redis");
const client = redis.createClient({
  password: '12345',
  socket: {
      host: 'redis-10430.c305.ap-south-1-1.ec2.cloud.redislabs.com',
      port: 10430
  }
});
  client.connect().catch(console.error)
// client.connect();


const setJWT = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
     return client.set(key,value, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
};


const getJWT = (key) => {
    console.log(key);
  return new Promise((resolve, reject) => {
    try {
    return  client.get(key, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
};
const deleteJWT = (key) => {
  try {
    client.del(key);
  } catch (error) {
    console.log(error);
  }
};



module.exports = {
  setJWT,
  getJWT,
  deleteJWT
};
