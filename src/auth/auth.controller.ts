import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDto } from 'src/user/dtos/new-user.dto';
import { UserDetails } from 'src/user/user-details.interface';
import { ExistingUserDto } from 'src/user/dtos/existing-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() user: NewUserDto): Promise<UserDetails | null> {
    return this.authService.register(user);
  }
  @Post('login')
  login(@Body() user: ExistingUserDto): Promise<{ token: string } | null> {
    return this.authService.login(user);
  }
}
