import * as authService from '../service/auth.service.js';
import * as googleAuthService from '../service/google.auth.service.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const token = await authService.verifyUserAndGenerateToken(username, password);

    res.status(200).json({ access_token: token });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { data } = req.body;

    const token = await authService.findOrCreateGoogleUserAndGenerateToken(data);

    res.status(200).json({ access_token: token });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

export const getGoogleAuthUrl = async (req, res) => {
  try {
    const url = await googleAuthService.getGoogleAuthUrl();

    res.status(200).json({ auth_url: url });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

export const getTokenByGoogleCode = async (req, res) => {
  try {
    const { code } = req.body;

    const token = await googleAuthService.getTokenByGoogleCode(code);
    console.log(token);

    res.status(200).json({ access_token: token });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

export const validators = {
  login: {
    username: { exists: true, errorMessage: 'username is required' },
    password: { exists: true, errorMessage: 'password is required' },
  },
  getTokenByGoogleCode: {
    code: { exists: true, errorMessage: 'code is required' },
  },
};
