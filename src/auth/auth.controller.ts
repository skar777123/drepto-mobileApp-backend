import { Controller, Get, UseGuards, Req, Res, Redirect } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './public.decorator';
import { GoogleAuthGuard } from './google-auth.guard';

@Controller('auth')
export class AuthController {
  
  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    // Initiates the Google OAuth flow
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @Redirect()
  googleAuthRedirect(@Req() req) {
    // The user and token are returned from the validate method of GoogleStrategy
    const { user, token } = req.user;
    // Redirect to frontend with token
    return { url: `https://www.dreptobiodevices.com/oauth-success?token=${token}&userId=${user.id}` };
  }

  @Public()
  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  async appleAuth(@Req() req) {
    // Initiates the Apple OAuth flow
  }

  @Public()
  @Get('apple/callback')
  @UseGuards(AuthGuard('apple'))
  appleAuthRedirect(@Req() req, @Res() res) {
    const { user, token } = req.user;
    // Redirect to frontend with token
    return res.redirect(`https://www.dreptobiodevices.com/oauth-success?token=${token}&userId=${user.id}`);
  }
}
