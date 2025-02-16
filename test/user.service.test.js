// filepath: /Users/azizul/projects/golpo-express/test/user.service.test.js
import * as userService from '../src/service/user.service.js';
import { User } from '../src/model/user.model.js';

jest.mock('../src/model/user.model.js');

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getUserByUsername should return user data', async () => {
    const mockUser = { username: 'testuser', password: 'password' };
    User.findOne.mockResolvedValue(mockUser);

    const user = await userService.getUserByUsername('testuser');
    expect(user).toEqual(mockUser);
    expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
  });
});