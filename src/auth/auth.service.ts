import { Injectable } from '@nestjs/common';
import { V2 } from 'paseto';
import { generateKeyPairSync } from 'crypto';

@Injectable()
export class AuthService {
  private readonly privateKey: Buffer;
  private readonly publicKey: Buffer;

  constructor() {
    const { privateKey, publicKey } = generateKeyPairSync('ed25519', {
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      publicKeyEncoding: { type: 'spki', format: 'pem' },
    });
    this.privateKey = Buffer.from(privateKey, 'utf8');
    this.publicKey = Buffer.from(publicKey, 'utf8');
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
