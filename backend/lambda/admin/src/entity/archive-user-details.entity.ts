import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { ArchiveUserRole } from './archive-user-roles.entity';

@Entity('archive_user_details')
@Unique(['user_name'])
export class ArchiveUserDetails {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'user_id' })
  id: number;

  @Column({ length: 50 })
  user_name: string;

  @Column({ length: 50, nullable: true })
  first_name: string;

  @Column({ length: 50, nullable: true })
  last_name: string;

  @Column({ length: 50, nullable: true })
  email: string;

  @OneToMany(() => ArchiveUserRole, (userRole) => userRole.user)
  userRoles: ArchiveUserRole[];
}
