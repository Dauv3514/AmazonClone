import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { NewUserDto } from 'src/user/dtos/new-user.dto';
import { UserDetails } from 'src/user/user-details.interface';
import { ExistingUserDto } from 'src/user/dtos/existing-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private UserService: UserService,
    private jwtService: JwtService,
  ) {}
  async hashPassword(password: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await bcrypt.hash(password, 12);
  }
  async register(user: Readonly<NewUserDto>): Promise<UserDetails | null> {
    const { name, email, password } = user;
    const existingUser = await this.UserService.findByEmail(email);
    if (existingUser) return null;
    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.UserService.create(name, email, hashedPassword);
    return this.UserService.__getUserDetails(newUser);
  }
  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await bcrypt.compare(password, hashedPassword);
  }
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.UserService.findByEmail(email);
    if (!user) return null;
    const isPasswordValid = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!isPasswordValid) return null;
    return this.UserService.__getUserDetails(user);
  }
  async login(
    existingUser: ExistingUserDto,
  ): Promise<{ token: string } | null> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);
    if (!user) return null;
    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }
}
