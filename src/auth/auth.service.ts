import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { V2 } from 'paseto';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService implements OnModuleInit {
  private privateKey: crypto.KeyObject;
  private publicKey: crypto.KeyObject;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const envPath = path.join(process.cwd(), '.env');
    let privateKeyPem = this.configService.get<string>('PASETO_PRIVATE_KEY');
    let publicKeyPem = this.configService.get<string>('PASETO_PUBLIC_KEY');

    if (!privateKeyPem || !publicKeyPem) {
      // Generate new keys if not present
      const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');
      privateKeyPem = privateKey.export({ type: 'pkcs8', format: 'der' }).toString('hex');
      publicKeyPem = publicKey.export({ type: 'spki', format: 'der' }).toString('hex');

      // Persist to .env file
      const envContent = fs.existsSync(envPath)
        ? fs.readFileSync(envPath, 'utf8')
        : '';
      const newEnvContent =
        envContent
          .replace(/PASETO_PRIVATE_KEY=.*/g, '')
          .replace(/PASETO_PUBLIC_KEY=.*/g, '')
          .trim() +
        `\nPASETO_PRIVATE_KEY=${privateKeyPem}\nPASETO_PUBLIC_KEY=${publicKeyPem}\n`;

      fs.writeFileSync(envPath, newEnvContent.trim() + '\n');

      this.privateKey = privateKey;
      this.publicKey = publicKey;
    } else {
      this.privateKey = crypto.createPrivateKey({ key: Buffer.from(privateKeyPem, 'hex'), format: 'der', type: 'pkcs8' });
      this.publicKey = crypto.createPublicKey({ key: Buffer.from(publicKeyPem, 'hex'), format: 'der', type: 'spki' });
    }
  }

  async generateToken(payload: any): Promise<string> {
    return await V2.sign(payload, this.privateKey);
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return await V2.verify(token, this.publicKey);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
