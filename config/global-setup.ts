import { FullConfig } from '@playwright/test';
import { apiGlobalSetup } from './api-global-setup';
import { uiGlobalSetup } from './ui-global-setup';

async function globalSetup(config: FullConfig) {
  console.log('⚡ Iniciando global-setup combinado...');

  // 1. Setup API
  await apiGlobalSetup(config);

  // 2. Setup UI
  //await uiGlobalSetup(config);

  console.log('🎉 Global-setup combinado completado');
}

export default globalSetup;
