import { chromium, FullConfig } from '@playwright/test';
import { AuthHelper } from './auth/ui/auth';

export async function uiGlobalTeardown(config: FullConfig) {
  console.log('>>>Ejecutando global-teardown - UI<<<');
  
  // Agregar logica de teardown si es necesario
  
  console.log('>>>Global-setup - UI completado correctamente<<<');
}

//export default uiGlobalSetup;