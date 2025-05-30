import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ArchiveUserDetails } from '@/entity/archive-user-details.entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { ArchiveRoles, ArchiveUserRole } from '@/entity';
import {
  CreateUserWithRolesDto,
  UpdateUserWithRolesDto,
} from '@/modules/user/dto';

@Injectable()
export class UserService extends TypeOrmCrudService<ArchiveUserDetails> {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(ArchiveUserDetails)
    private readonly userRepository: Repository<ArchiveUserDetails>,
    @InjectRepository(ArchiveUserRole)
    private readonly userRoleRepository: Repository<ArchiveUserRole>,
    @InjectRepository(ArchiveRoles)
    private readonly rolesRepository: Repository<ArchiveRoles>,
  ) {
    super(userRepository);
  }
  async findAllWithRoles() {
    const users = await this.userRepository.find({
      relations: ['userRoles', 'userRoles.role'],
    });

    return users.map((user) => ({
      ...user,
      userRoles: user.userRoles.map((ur) => {
        // Exclude user_id, role_id, and wrap only role details (flattened)
        const { role } = ur;
        if (role) {
          return role; // Return only the role details
        }
        return {};
      }),
    }));
  }

  async findOneWithRoles(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) return null;

    return {
      ...user,
      userRoles: user.userRoles.map((ur) => {
        const { role } = ur;
        if (role) {
          return role; // Return only the role details
        }
        return {};
      }),
    };
  }

  async createUserWithRoles(createDto: CreateUserWithRolesDto) {
    // Create user
    const { roles, ...userData } = createDto;
    // Save user and ensure the entity is fully persisted
    const user = await this.userRepository.save(userData);
    if (roles && Array.isArray(roles) && roles.length > 0) {
      const userRoles = roles.map((role_id: number) =>
        this.userRoleRepository.create({ user_id: user.id, role_id }),
      );
      await this.userRoleRepository.save(userRoles);
    }

    return this.findOneWithRoles(user.id);
  }

  async updateUserAndRoles(id: number, updateDto: UpdateUserWithRolesDto) {
    // Update user details
    const { roles, ...userData } = updateDto;
    await this.userRepository.update(id, userData);

    // If roles are provided, update them
    if (roles && Array.isArray(roles)) {
      // Remove existing roles
      await this.userRoleRepository.delete({ user_id: id });

      // Find valid roles
      const matchedRoles = await this.rolesRepository.find({
        where: { id: In(roles) },
      });

      // Assign new roles
      const userRoles = matchedRoles.map((role) =>
        this.userRoleRepository.create({ user_id: id, role_id: role.id }),
      );
      await this.userRoleRepository.save(userRoles);
    }

    // Return updated user with roles
    return this.findOneWithRoles(id);
  }
}
