import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { config, validateConfig } from '../../config/auth/ui/config';
import { MfaHelper } from '../../config/auth/ui/mfaHelper';
import users from '../../data/users.json';
import * as allure from 'allure-js-commons';

// Combinamos usuarios de users.json + usuario válido de .env
const allTestUsers = [
  // Usuarios de users.json (todos inválidos)
  ...Object.entries(users).map(([key, userData]) => ({
    id: key,
    email: userData.email,
    password: userData.password,
    description: `Usuario inválido: ${key}`,
    isValid: false
  })),
  // Usuario válido de .env
  {
    id: 'valid_user',
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    description: 'Usuario válido de .env',
    isValid: true
  }
];

test.describe('Login Tests - Todos los usuarios (users.json + .env)', () => {

  test.beforeAll(() => {
    validateConfig();
  });    

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();

  });

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    await page.screenshot({ 
      path: `test-results/failed-${testInfo.title.replace(/\s+/g, '-')}.png` 
    });
  }
});

// Inicia el TC de login
  for (const userCase of allTestUsers) {
    test(`${userCase.description} - ${userCase.id}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await allure.tags('smoke', 'regression', 'ui');
      
      console.log(`🧪 Testing user: ${userCase.id}`);
      console.log(`"?" Expected to be valid: ${userCase.isValid}`);
      
      // 1. Ir a la página de login
    await test.step('Ir a la página de login', async () => {
        await loginPage.gotoLogin();

      });
      
      // 2. Llenar credenciales
    await test.step('Llenar credenciales', async () => {
        await loginPage.fillCredentials(userCase.email!, userCase.password!);
    });

      // 3. Hacer click en login
    await test.step('Hacer click en login', async () => {
      await loginPage.submit();
    });

      // 4. Manejar MFA si es usuario válido
      if (userCase.isValid) {
        await test.step('Completar MFA (si es necesario)', async () => {
          try {
            // Verificar si aparece el campo MFA

            await loginPage.ValidateMFALogin();

            console.log('🔐 MFA detected - generating code automatically...');
            const mfaCode = MfaHelper.generateMfaCode();
            console.log(`🔐 Generated MFA code: ${mfaCode}`);
            
            await loginPage.completeMfa(mfaCode);
          } catch (error) {
            // Si no hay MFA requerido, continúa normalmente
            console.log('ℹ️  No MFA required for this login');
          }
        });
      }
      /* GENERAR ERROR PORQUE CHOCAN LOS TIMEOUT CON LA CONFIGURACION GLOBAL CON USER_INVALID_2 */
      // 5. Esperar un momento para que procese
      // await test.step('Esperar un momento para que procese', async () => {
      //   await page.waitForTimeout(3000);
      // });
            
      // Validar login usando el método del Page Object
      await test.step('Validar login', async () => {
        await loginPage.validateLogin(userCase.isValid, userCase);
        console.log(`Test completed for user: ${userCase.id}\n`);

      });
    });
  }
});