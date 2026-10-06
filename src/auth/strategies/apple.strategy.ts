import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {
    super({
      clientID: process.env.APPLE_CLIENT_ID || 'your_apple_client_id',
      teamID: process.env.APPLE_TEAM_ID || 'your_team_id',
      callbackURL: 'https://api.dreptobiodevices.com/auth/apple/callback',
      keyID: process.env.APPLE_KEY_ID || 'your_key_id',
      privateKeyString: process.env.APPLE_PRIVATE_KEY || 'your_private_key',
      passReqToCallback: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, idToken: string, profile: any, done: any): Promise<any> {
    const { id, email, name } = profile || {};
    
    // Find or create user
    const user = await this.userService.findOrCreateOAuthUser({
      provider: 'apple',
      id,
      email: email || '',
      firstName: name?.firstName || 'Apple',
      lastName: name?.lastName || 'User',
    });

    done(null, user);
  }
}
