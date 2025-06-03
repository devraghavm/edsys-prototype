import { ArchiveRoles } from '@/entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService extends TypeOrmCrudService<ArchiveRoles> {
  constructor(
    @InjectRepository(ArchiveRoles)
    private readonly rolesRepository: Repository<ArchiveRoles>,
  ) {
    super(rolesRepository);
  }
}
