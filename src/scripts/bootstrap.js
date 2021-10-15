const mongoose = require("mongoose");

const config = require("../config");
const userService = require("../service/user.service");

const mongooseConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose.connect(config.mongoUrl, mongooseConnectOptions);

void (async function () {
  data = {
    username: "test",
    password: "test",
  };
  user = await userService.getUserByUsernameAndPass("test", "test");
  if (!user) {
    user = await userService.createUser(data);
    console.log(user);
    meta = await userService.createUserMeta({ username: user.username });
    console.log(meta);
  }
  data = {
    username: "test2",
    password: "test2",
  };
  user = await userService.getUserByUsernameAndPass("test2", "test2");
  if (!user) {
    user = await userService.createUser(data);
    console.log(user);
    meta = await userService.createUserMeta({ username: user.username });
    console.log(meta);
  }
  data = {
    username: "Adam",
    password: "eve",
  };
  user = await userService.getUserByUsernameAndPass("Adam", "eve");
  if (!user) {
    user = await userService.createUser(data);
    console.log(user);
    meta = await userService.createUserMeta({ username: user.username });
    console.log(meta);
  }

  mongoose.disconnect();
})();
