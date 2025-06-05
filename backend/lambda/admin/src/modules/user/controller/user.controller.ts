import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '@/modules/user/service/user.service';
import { ArchiveUserDetails } from '@/entity/archive-user-details.entity';
import { Crud, CrudController } from '@dataui/crud';
import {
  CreateUserWithRolesDto,
  UpdateUserWithRolesDto,
} from '@/modules/user/dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
@Crud({ model: { type: ArchiveUserDetails } })
@ApiTags('users')
@Controller('users')
export class UserController implements CrudController<ArchiveUserDetails> {
  constructor(public readonly service: UserService) {}

  @Get('with-roles')
  @ApiOperation({ summary: 'Get all users with their roles' })
  @ApiResponse({
    status: 200,
    description: 'List of users with roles',
    type: [ArchiveUserDetails],
  })
  async findAllWithRoles() {
    return this.service.findAllWithRoles();
  }

  @Get(':id/with-roles')
  @ApiOperation({ summary: 'Get a user with roles by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User with roles',
    type: ArchiveUserDetails,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOneWithRoles(@Param('id') id: number) {
    return this.service.findOneWithRoles(Number(id));
  }

  @Post('with-roles')
  @ApiOperation({ summary: 'Create a user with roles' })
  @ApiBody({ type: CreateUserWithRolesDto })
  @ApiResponse({
    status: 201,
    description: 'User created with roles',
    type: ArchiveUserDetails,
  })
  async createUserWithRoles(@Body() createDto: CreateUserWithRolesDto) {
    return this.service.createUserWithRoles(createDto);
  }

  @Put(':id/with-roles')
  @ApiOperation({ summary: 'Update a user and their roles' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({ type: UpdateUserWithRolesDto })
  @ApiResponse({
    status: 200,
    description: 'User and roles updated',
    type: ArchiveUserDetails,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUserAndRoles(
    @Param('id') id: number,
    @Body() updateDto: UpdateUserWithRolesDto,
  ) {
    return this.service.updateUserAndRoles(Number(id), updateDto);
  }
}
