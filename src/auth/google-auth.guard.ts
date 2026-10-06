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
      // Return the error message directly to the client for debugging
      throw new HttpException(
        {
          message: 'Google Auth Error',
          error: err.message || err,
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
