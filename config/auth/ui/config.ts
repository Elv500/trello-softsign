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

  // Configuración del navegador
  browser: {
    // el headless se define en playwright.config.ts
  },

  // Datos de prueba específicos de la aplicación
  testData: {
    // Aquí puedes agregar datos de prueba específicos
  }
};

// Validar que las variables críticas están definidas //////Aumentar el MFA//////
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