import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signup(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.userService.createUser(createUserDto);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
