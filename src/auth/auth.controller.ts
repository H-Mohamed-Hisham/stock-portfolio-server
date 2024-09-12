import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

// Auth
import { AuthService } from './auth.service';
import { AuthEntity } from './entities/auth.entity';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOkResponse({ type: AuthEntity })
  SignIn(@Body() { email, password }: SignInDto) {
    return this.authService.signIn(email, password);
  }
}
