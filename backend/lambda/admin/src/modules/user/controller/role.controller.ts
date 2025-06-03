import { ArchiveRoles } from '@/entity';
import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { RoleService } from '@/modules/user/service/role.service';

@Crud({
  model: {
    type: ArchiveRoles,
  },
})
@Controller('roles')
export class RoleController implements CrudController<ArchiveRoles> {
  constructor(public readonly service: RoleService) {}
}
