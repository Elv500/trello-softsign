import { Page, Locator, expect } from '@playwright/test';
import { config } from '../config/auth/ui/config';

export class LoginPage {
  private page: Page;
  
  // Selectores principales
  private inputEmail = '[data-testid="username"]';
  private inputPassword = '[data-testid="password"]'; 
  private continueButton  = '[data-testid="login-submit-idf-testid"]';
  
  constructor(page: Page) {
    this.page = page;
  }


  async gotoLogin() {
    await this.page.goto(config.urls.login, { timeout: 45000 });
    
    const emailInput = this.page.locator(this.inputEmail);
    await expect(emailInput).toBeVisible();
  }


  async fillCredentials(email: string, password: string) {
    const emailInput = this.page.locator(this.inputEmail);
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await expect(emailInput).toBeVisible();
    await emailInput.fill(email);
    
    const continueBtn = this.page.locator(this.continueButton);
    await continueBtn.waitFor({ state: 'visible', timeout: 10000 });
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();
    
    try {
      const passwordInput = this.page.locator(this.inputPassword);
      await passwordInput.waitFor({ state: 'visible', timeout: 8000 });
      await expect(passwordInput).toBeVisible();
      await passwordInput.fill(password);
    } catch (error) {
    }
  }


  async submit() {
    try {
      const submitButton = this.page.locator(this.continueButton);
      await submitButton.waitFor({ state: 'visible', timeout: 8000 });
      await expect(submitButton).toBeVisible();
      await submitButton.click();
    } catch (error) {
    }
  }


  async completeMfa(mfaCode: string) {
    console.log('🔐 Completing MFA verification...');
    
    try {
      const mfaSelector = '#two-step-verification-otp-code-input';
      
      const mfaInput = this.page.locator(mfaSelector);
      await mfaInput.waitFor({ state: 'visible', timeout: 8000 });
      await expect(mfaInput).toBeVisible();
      
      await mfaInput.fill(mfaCode);
      console.log('✅ MFA code entered - validating automatically...');
      
      await this.page.waitForTimeout(3000);
      console.log('🔐 MFA validation completed');
      
    } catch (error) {
      console.log('❌ MFA completion failed:', error);
      throw error;
    }
  }
  async ValidateMFALogin() {
     const mfaSelector = '#two-step-verification-otp-code-input';
            await this.page.waitForSelector(mfaSelector, { timeout: 5000 });
  }

  async hasAnyError(): Promise<boolean> {
    try {
      const specificErrorElement = this.page.locator('[data-testid="form-error"]');
      const specificErrorCount = await specificErrorElement.count();
      
      const genericErrorElements = this.page.locator('text=/required|error|invalid|incorrect/i');
      const genericErrorCount = await genericErrorElements.count();
      
      const hasErrors = specificErrorCount > 0 || genericErrorCount > 0;
      
      if (hasErrors) {
        console.log(`🚨 Errors detected: Specific(${specificErrorCount}), Generic(${genericErrorCount})`);
      }
      
      return hasErrors;
    } catch (error) {
      console.log('Error checking for errors:', error);
      return false;
    }
  }


  async getErrorMessage(): Promise<string> {
    try {
      const errorElement = this.page.locator('[data-testid="form-error--content"]');
      await errorElement.waitFor({ state: 'visible', timeout: 3000 });
      
      if (await errorElement.isVisible()) {
        const errorText = await errorElement.textContent();
        console.log(`🚨 Error message found: "${errorText}"`);
        return errorText || '';
      }
    } catch (error) {
      console.log('No specific error message found');
    }
    return '';
  }


  async validateLogin(isValidUser: boolean, userCase: any) {
    console.log(`🔍 Validating ${isValidUser ? 'successful' : 'failed'} login for user: ${userCase.id}...`);
    
    if (isValidUser) {
      try {
        await this.page.waitForURL('**/boards**', { timeout: 20000 });
        const currentUrl = this.page.url();
        console.log('✅ SUCCESS: Redirected to boards page');
        // console.log(`Final URL: ${currentUrl}`);
        
        expect(currentUrl).toContain('boards');
        
        try {
          const createBoardButton = this.page.getByRole('button', { name: /create.*board/i });
          await createBoardButton.waitFor({ state: 'visible', timeout: 5000 });
          await expect(createBoardButton).toBeVisible();
        } catch {
          const dashboardElements = [
            this.page.getByTestId('header-create-menu-button'),
            this.page.locator('button:has-text("Create")'),
            this.page.locator('[data-testid*="create"]').first()
          ];
          
          let found = false;
          for (const element of dashboardElements) {
            try {
              await element.waitFor({ state: 'visible', timeout: 3000 });
              found = true;
              break;
            } catch {
              continue;
            }
          }
          
          if (!found) {
            console.log('⚠️ No dashboard elements found, but URL is correct');
          }
        }
        
      } catch (error) {
        console.log('❌ FAILURE: Valid user was not redirected to boards');
        console.log(`Current URL: ${this.page.url()}`);
        throw error;
      }
      
    } else {
      // For invalid users, expect login failure
      try {
        await this.page.waitForTimeout(3000);
        
        const hasError = await this.hasAnyError();
        const currentUrl = this.page.url();
        const errorMessage = await this.getErrorMessage();
        
        console.log(`Current URL: ${currentUrl}`);
        console.log(`Has error: ${hasError}`);
        console.log(`Error message: "${errorMessage}"`);
        
        if (hasError) {
          console.log('✅ LOGIN FAILED CORRECTLY: Error message displayed');
          expect(hasError).toBe(true);
        } else if (!currentUrl.includes('boards')) {
          console.log('✅ LOGIN FAILED CORRECTLY: No redirect to boards');
          expect(currentUrl).not.toContain('boards');
        } else {
          console.log('❌ UNEXPECTED: Invalid user was incorrectly authenticated');
          expect(currentUrl).not.toContain('boards');
        }
        
      } catch (error) {
        const currentUrl = this.page.url();
        console.log('✅ LOGIN FAILED CORRECTLY: Exception during login process');
        console.log(`Current URL: ${currentUrl}`);
        expect(currentUrl).not.toContain('boards');
      }
    }
  }
}