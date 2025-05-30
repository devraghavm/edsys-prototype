import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ArchiveUserRole } from './archive-user-roles.entity';

@Entity('archive_roles')
export class ArchiveRoles {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'role_id' })
  id: number;

  @Column({ length: 50 })
  role_name: string;

  @Column({ length: 255 })
  role_desc: string;

  @Column('tinyint')
  priority: number;

  @OneToMany(() => ArchiveUserRole, (userRole) => userRole.role)
  userRoles: ArchiveUserRole[];
}
