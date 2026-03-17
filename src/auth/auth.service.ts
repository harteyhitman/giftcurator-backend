import { randomUUID } from 'crypto';

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.usersService.findOne(normalizedEmail);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: user.mobileNumber,
      },
    };
  }

  async register(data: RegisterDto) {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existingUser = await this.usersService.findOne(normalizedEmail);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      ...data,
      email: normalizedEmail,
      mobileNumber: data.mobileNumber.trim(),
      password: hashedPassword,
    });

    const { password, ...result } = user;
    return result;
  }

  /**
   * Verify Google ID token and return same shape as login (JWT for API).
   * Creates user on first sign-in. GOOGLE_CLIENT_ID must match the web client ID.
   */
  async loginWithGoogleIdToken(idToken: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    if (!clientId) {
      throw new UnauthorizedException('Google sign-in is not configured on the server');
    }

    const client = new OAuth2Client(clientId);
    let email: string;
    let givenName: string | undefined;
    let familyName: string | undefined;
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      if (!payload?.email) {
        throw new UnauthorizedException('Google account has no email');
      }
      email = payload.email.toLowerCase();
      givenName = payload.given_name;
      familyName = payload.family_name;
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new UnauthorizedException('Invalid Google token');
    }
    let user = await this.usersService.findOne(email);

    if (!user) {
      const placeholderPassword = await bcrypt.hash(randomUUID(), 10);
      user = await this.usersService.create({
        email,
        password: placeholderPassword,
        firstName: givenName?.trim() || 'Google',
        lastName: familyName?.trim() || 'User',
        mobileNumber: '0000000000',
      });
    }

    const { password, ...result } = user;
    return this.login(result);
  }
}
