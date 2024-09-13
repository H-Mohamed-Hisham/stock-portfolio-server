import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Delete,
  // Req,
  // Param,
  // Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

// User
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

// Auth
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LoggedInUser } from 'src/auth/auth.decorator';
import { AuthUserEntity } from '@app/auth/entities/auth.entity';

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
  async findProfile(@LoggedInUser() loggedInUser: AuthUserEntity) {
    return new UserEntity(await this.userService.profile(loggedInUser));
  }

  // * UPDATE
  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @LoggedInUser() loggedInUser: AuthUserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(
      await this.userService.update(loggedInUser, updateUserDto),
    );
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
  @Delete('/remove')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@LoggedInUser() loggedInUser: AuthUserEntity) {
    return new UserEntity(await this.userService.remove(loggedInUser));
  }
}
