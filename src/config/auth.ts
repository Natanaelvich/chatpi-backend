export default {
  jwt: {
    secret: process.env.APP_SECRET || 'secret-fake',
    exp: '5s',
    secret_refresh_token: process.env.APP_SECRET || 'secret-fake',
    expires_in_refresh_token: '30d',
    expires_refresh_token_days: 30,
  },
};
