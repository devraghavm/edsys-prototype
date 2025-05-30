import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchiveUserDetails } from '@/entity/archive-user-details.entity';
import { ArchiveUserRole } from '@/entity/archive-user-roles.entity';
import { ArchiveRoles } from '@/entity/archive-roles.entity';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArchiveUserDetails,
      ArchiveUserRole,
      ArchiveRoles,
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
