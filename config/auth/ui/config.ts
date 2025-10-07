export const config = {
  urls: {
    base: process.env.BASE_URL_UI,
    login: `${process.env.BASE_URL_UI}/login`,
    dashboard: `${process.env.BASE_URL_UI}/u/${process.env.USERNAME}/boards`
  },

  user: {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  },

  browser: {

  },

  testData: {
   
  }
};

export const validateConfig = () => {
  const requiredVars = [
    { key: 'email', value: config.user.email },
    { key: 'password', value: config.user.password },
    { key: 'baseUrl', value: config.urls.base },
  ];

  const missing = requiredVars.filter(({ value }) => !value);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required configuration: ${missing.map(({ key }) => key).join(', ')}\n` +
      'Please check your app-config.json file'
    );
  }
    return true;
};

export default config;