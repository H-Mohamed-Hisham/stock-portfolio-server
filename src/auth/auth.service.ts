import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// Prisma
import { PrismaService } from 'src/prisma/prisma.service';

// Auth
import { AuthEntity } from '@app/auth/entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<AuthEntity> {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    return {
      access_token: this.jwtService.sign({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
