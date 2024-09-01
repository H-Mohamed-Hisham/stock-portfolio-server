import { Injectable, Request } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Prisma
import { PrismaService } from '@app/prisma/prisma.service';

// User
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStorage } from './user.storage';

// Constants
export const roundsOfHashing = 7;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // * CREATE
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );
    createUserDto.password = hashedPassword;

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  // * LIST
  // findAll(req: any) {
  //   console.log('REQ :: ', req.user);
  //   return this.prisma.user.findMany();
  // }

  // * FIND BY ID
  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
      },
    });
  }

  // * PROFILE
  async profile() {
    const logged_in_user = UserStorage.get();
    return this.prisma.user.findUnique({
      where: { id: logged_in_user.id },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
      },
    });
  }

  // * UPDATE
  async update(updateUserDto: UpdateUserDto) {
    const logged_in_user = UserStorage.get();
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }
    return this.prisma.user.update({
      where: { id: logged_in_user.id },
      data: updateUserDto,
    });
  }

  // * UPDATE BY ID
  // async update(id: string, updateUserDto: UpdateUserDto) {
  //   if (updateUserDto.password) {
  //     updateUserDto.password = await bcrypt.hash(
  //       updateUserDto.password,
  //       roundsOfHashing,
  //     );
  //   }
  //   return this.prisma.user.update({ where: { id }, data: updateUserDto });
  // }

  // * REMOVE
  // remove(id: string) {
  //   return this.prisma.user.delete({
  //     where: { id },
  //   });
  // }
}
