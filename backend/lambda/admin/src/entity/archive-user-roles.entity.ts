import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ArchiveUserDetails } from './archive-user-details.entity';
import { ArchiveRoles } from './archive-roles.entity';

@Entity('archive_user_roles')
export class ArchiveUserRole {
  @PrimaryColumn({ type: 'int', unsigned: true })
  user_id: number;

  @PrimaryColumn({ type: 'int', unsigned: true })
  role_id: number;

  @ManyToOne(() => ArchiveUserDetails, (user) => user.userRoles, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: ArchiveUserDetails;

  @ManyToOne(() => ArchiveRoles, (role) => role.userRoles, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: ArchiveRoles;
}
