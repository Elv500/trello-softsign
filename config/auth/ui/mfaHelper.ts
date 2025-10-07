import * as speakeasy from 'speakeasy';

export class MfaHelper {
  
  /**
   * Genera un código MFA de 6 dígitos usando el secret de .env
   * @returns Código MFA de 6 dígitos
   */
  static generateMfaCode(): string {
    if (!process.env.MFA) {
      throw new Error('MFA secret not found in .env');
    }

    try {
      const token = speakeasy.totp({
        secret: process.env.MFA,
        encoding: 'base32',
        digits: 6,
        step: 30
      });

      return token;
    } catch (error) {
      throw new Error(`Failed to generate MFA code: ${error}`);
    }
  }

  static isValidMfaCode(code: string): boolean {
    return /^\d{6}$/.test(code);
  }

  static async getCurrentMfaCode(): Promise<string> {
    const code = this.generateMfaCode();
    
    if (!this.isValidMfaCode(code)) {
      throw new Error(`Invalid MFA code format: ${code}. Expected 6 digits.`);
    }
    
    console.log(`🔐 Generated MFA code: ${code}`);
    return code;
  }
}