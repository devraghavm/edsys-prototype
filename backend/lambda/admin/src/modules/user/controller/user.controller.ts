import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '@/modules/user/service/user.service';
import { ArchiveUserDetails } from '@/entity/archive-user-details.entity';
import { Crud, CrudController } from '@dataui/crud';
import {
  CreateUserWithRolesDto,
  UpdateUserWithRolesDto,
} from '@/modules/user/dto';

@Crud({ model: { type: ArchiveUserDetails } })
@Controller('users')
export class UserController implements CrudController<ArchiveUserDetails> {
  constructor(public readonly service: UserService) {}
  @Get('with-roles')
  async findAllWithRoles() {
    return this.service.findAllWithRoles();
  }

  @Get(':id/with-roles')
  async findOneWithRoles(@Param('id') id: number) {
    return this.service.findOneWithRoles(Number(id));
  }

  @Post('with-roles')
  async createUserWithRoles(@Body() createDto: CreateUserWithRolesDto) {
    return this.service.createUserWithRoles(createDto);
  }

  @Put(':id/with-roles')
  async updateUserAndRoles(
    @Param('id') id: number,
    @Body() updateDto: UpdateUserWithRolesDto,
  ) {
    return this.service.updateUserAndRoles(Number(id), updateDto);
  }
}
