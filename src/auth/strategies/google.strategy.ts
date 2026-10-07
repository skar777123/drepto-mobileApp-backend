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
    try {
      const { id, name, emails } = profile;
      
      const email = emails && emails.length > 0 ? emails[0].value : null;
      const firstName = name ? name.givenName : '';
      const lastName = name ? name.familyName : '';
      
      // Find or create user
      const user = await this.userService.findOrCreateOAuthUser({
        provider: 'google',
        id,
        email,
        firstName,
        lastName,
      });

      done(null, user);
    } catch (error) {
      console.error('Google Auth Error:', error);
      done(error, false);
    }
  }
}
