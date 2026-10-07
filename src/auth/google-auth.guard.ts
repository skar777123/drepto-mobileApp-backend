import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor() {
    super({
      accessType: 'offline',
      prompt: 'consent',
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const res = context.switchToHttp().getResponse();

    // Passport expects an Express Response object.
    // Since we are using Fastify, we need to mock these methods so Passport can redirect.
    if (!res.setHeader) {
      res.setHeader = function (key: string, value: string) {
        return this.header(key, value);
      };
    }
    if (!res.end) {
      res.end = function () {
        return this.send('');
      };
    }

    const result = (await super.canActivate(context)) as boolean;
    return result;
  }

  handleRequest(err, user, info, context, status) {
    if (err) {
      console.error('--- GOOGLE AUTH ERROR DETAILS ---');
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error properties:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      console.error('Info:', info);
      console.error('---------------------------------');
      
      // Return the error message directly to the client for debugging
      throw new HttpException(
        {
          message: 'Google Auth Error',
          error: err.message || err,
          // Extract specific oauth2 error details if available
          oauthError: err.oauthError || err.internal, 
          info: info,
          stack: err.stack,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!user) {
      throw new HttpException('No user found', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
