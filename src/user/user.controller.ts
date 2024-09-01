import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  // Req,
  // Param,
  // Delete,
  // Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { Request } from 'express';

// User
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

// Auth
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // * CREATE
  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.userService.create(createUserDto));
  }

  // * LIST
  // @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOkResponse({ type: UserEntity, isArray: true })
  // async findAll(@Req() req: Request) {
  //   const users = await this.userService.findAll(req);
  //   return users.map((user) => new UserEntity(user));
  // }

  // * FIND BY ID
  // @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOkResponse({ type: UserEntity })
  // async findOne(@Param('id') id: string) {
  //   return new UserEntity(await this.userService.findOne(id));
  // }

  // * PROFILE
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findProfile() {
    return new UserEntity(await this.userService.profile());
  }

  // * UPDATE
  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async update(@Body() updateUserDto: UpdateUserDto) {
    return new UserEntity(await this.userService.update(updateUserDto));
  }

  // * UPDATE BY ID
  // @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiCreatedResponse({ type: UserEntity })
  // async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return new UserEntity(await this.userService.update(id, updateUserDto));
  // }

  // * DELETE
  // @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOkResponse({ type: UserEntity })
  // async remove(@Param('id') id: string) {
  //   return new UserEntity(await this.userService.remove(id));
  // }
}
