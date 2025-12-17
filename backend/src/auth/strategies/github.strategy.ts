import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, Profile } from 'passport-github2';
import { AuthService } from '../auth.service.js';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID:
        configService.get<string>('GITHUB_CLIENT_ID') || 'github-client-id',
      clientSecret:
        configService.get<string>('GITHUB_CLIENT_SECRET') ||
        'github-client-secret',
      callbackURL:
        configService.get<string>('GITHUB_CALLBACK_URL') ||
        'http://localhost:3001/api/auth/github/callback',
      scope: ['user:email', 'read:user'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ): Promise<any> {
    try {
      const authResponse = await this.authService.handleGitHubLogin(profile);
      done(null, authResponse);
    } catch (error) {
      done(error, null);
    }
  }
}
