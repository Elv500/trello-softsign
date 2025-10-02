import { chromium, FullConfig } from '@playwright/test';
import { AuthHelper } from './auth/ui/auth';

export async function uiGlobalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Realizar login una vez y guardar el estado
    await AuthHelper.loginAndSaveState(page);
    
    // Guardar el estado de autenticación
    await page.context().storageState({ path: 'auth-state.json' });
    console.log('💾 Authentication state saved to auth-state.json');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('✅ Global setup completed successfully');
}

//export default uiGlobalSetup;