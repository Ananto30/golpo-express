import mongoose from 'mongoose';
import config from '../config';
import * as userService from '../service/user.service';

mongoose.connect(config.mongoUrl);

void (async function () {
  let data = {
    username: 'test',
    password: 'test',
  };
  let user = await userService.getUserByUsernameAndPass('test', 'test');
  if (!user) {
    user = await userService.createUser(data);
    console.log(user);
    let meta = await userService.createUserMeta({ username: user.username });
    console.log(meta);
  }
  data = {
    username: 'test2',
    password: 'test2',
  };
  user = await userService.getUserByUsernameAndPass('test2', 'test2');
  if (!user) {
    user = await userService.createUser(data);
    console.log(user);
    let meta = await userService.createUserMeta({ username: user.username });
    console.log(meta);
  }
  data = {
    username: 'Adam',
    password: 'eve',
  };
  user = await userService.getUserByUsernameAndPass('Adam', 'eve');
  if (!user) {
    user = await userService.createUser(data);
    console.log(user);
    let meta = await userService.createUserMeta({ username: user.username });
    console.log(meta);
  }

  mongoose.disconnect();
})();
