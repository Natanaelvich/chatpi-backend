export default {
  jwt: {
    secret: process.env.APP_SECRET || 'secret-fake',
    exp: '1d',
  },
};
