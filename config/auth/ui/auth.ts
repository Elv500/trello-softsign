import { Page } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { MfaHelper } from './mfaHelper';

export class AuthHelper {

  static async loginAndSaveState(page: Page): Promise<void> {
    const loginPage = new LoginPage(page);
    
    console.log('🔐 Performing global login...');
    await loginPage.gotoLogin();
    await loginPage.fillCredentials(process.env.EMAIL!, process.env.PASSWORD!);

    await loginPage.submit();
        await page.waitForTimeout(3000);
    const currentUrl = page.url();
    
    if (currentUrl.includes('mfa') || currentUrl.includes('login/mfa')) {
      console.log('🔐 MFA detected - generating code automatically...');
      const mfaCode = await MfaHelper.getCurrentMfaCode();
      await loginPage.completeMfa(mfaCode);
    } else {
      console.log('ℹ️  No MFA required - login completed directly');
    }  
    await loginPage.validateLogin(true, {
      id: 'valid_user',
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
      description: 'Usuario válido de .env',
      isValid: true
    });
    
    console.log('✅ Global login successful - Session ready');
  }

  static async quickLogin(page: Page): Promise<void> {
    const loginPage = new LoginPage(page);
    
    await loginPage.gotoLogin();
    await loginPage.fillCredentials(process.env.EMAIL!, process.env.PASSWORD!);
    await loginPage.submit();
    
    await page.waitForURL('**/boards**', { timeout: 10000 });
  }
}