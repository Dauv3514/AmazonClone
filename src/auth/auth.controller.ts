import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDto } from 'src/user/dtos/new-user.dto';
import { UserDetails } from 'src/user/user-details.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() user: NewUserDto): Promise<UserDetails | null> {
    return this.authService.register(user);
  }
}
