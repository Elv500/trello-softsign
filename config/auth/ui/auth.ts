import { Page } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { MfaHelper } from './mfaHelper';

export class AuthHelper {
  
  /**
   * Realiza login completo y mantiene la sesión activa
   */
  static async loginAndSaveState(page: Page): Promise<void> {
    const loginPage = new LoginPage(page);
    
    console.log('🔐 Performing global login...');
    await loginPage.gotoLogin();
    await loginPage.fillCredentials(process.env.EMAIL!, process.env.PASSWORD!);

    await loginPage.submit();
        await page.waitForTimeout(3000);
    const currentUrl = page.url();
    
    // Generar código automáticamente y completarlo
    if (currentUrl.includes('mfa') || currentUrl.includes('login/mfa')) {
      console.log('🔐 MFA detected - generating code automatically...');
      const mfaCode = await MfaHelper.getCurrentMfaCode();
      await loginPage.completeMfa(mfaCode);
    } else {
      console.log('ℹ️  No MFA required - login completed directly');
    }    // Validar que el login fue exitoso (debe llegar a boards)
    await loginPage.validateLogin(true, {
      id: 'valid_user',
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
      description: 'Usuario válido de .env',
      isValid: true
    });
    
    console.log('✅ Global login successful - Session ready');
  }

  /**
   * Solo realiza login sin validaciones adicionales (más rápido)
   */
  static async quickLogin(page: Page): Promise<void> {
    const loginPage = new LoginPage(page);
    
    await loginPage.gotoLogin();
    await loginPage.fillCredentials(process.env.EMAIL!, process.env.PASSWORD!);
    await loginPage.submit();
    
    // Esperar solo a que llegue a boards
    await page.waitForURL('**/boards**', { timeout: 10000 });
  }
}