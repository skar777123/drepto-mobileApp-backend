import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret',
      callbackURL: 'https://api.dreptobiodevices.com/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, name, emails } = profile;
    
    // Find or create user
    const user = await this.userService.findOrCreateOAuthUser({
      provider: 'google',
      id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    });

    done(null, user);
  }
}
